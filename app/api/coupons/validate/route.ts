import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { code, orderAmount } = await request.json()

    if (!code) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 })
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
            } catch {}
          },
        },
      },
    )

    const { data: coupon, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", code.toUpperCase())
      .single()

    if (error || !coupon) {
      return NextResponse.json({ error: "Invalid coupon code" }, { status: 404 })
    }

    if (!coupon.is_active) {
      return NextResponse.json({ error: "This coupon is not active" }, { status: 400 })
    }

    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return NextResponse.json({ error: "This coupon has expired" }, { status: 400 })
    }

    if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
      return NextResponse.json({ error: "This coupon has reached its usage limit" }, { status: 400 })
    }

    if (coupon.min_order_amount && orderAmount < coupon.min_order_amount) {
      return NextResponse.json(
        { error: `Minimum order amount of $${coupon.min_order_amount} required` },
        { status: 400 },
      )
    }

    let discount = 0
    if (coupon.type === "percentage") {
      discount = (orderAmount * coupon.value) / 100
      if (coupon.max_discount && discount > coupon.max_discount) {
        discount = coupon.max_discount
      }
    } else {
      discount = coupon.value
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        description: coupon.description,
      },
      discount,
    })
  } catch (error) {
    console.error("Error validating coupon:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
