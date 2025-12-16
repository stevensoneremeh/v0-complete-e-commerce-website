import { createBrowserClient } from "@supabase/ssr"

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null
let initializationPromise: Promise<ReturnType<typeof createBrowserClient>> | null = null

export function createClient() {
  // Return existing client if already created
  if (supabaseClient) {
    return supabaseClient
  }

  // If initialization is in progress, wait for it
  if (initializationPromise) {
    throw new Error("Client initialization already in progress")
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("[v0] Supabase environment variables not configured. Using mock client.")
    return createMockClient()
  }

  try {
    supabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: "pkce",
      },
      global: {
        headers: {
          "x-client-info": "abl-natasha-web",
        },
      },
    })

    console.log("[v0] Supabase client initialized successfully")
    return supabaseClient
  } catch (error) {
    console.error("[v0] Failed to initialize Supabase client:", error)
    return createMockClient()
  }
}

export function resetClient() {
  supabaseClient = null
  initializationPromise = null
}

function createQueryBuilder() {
  return {
    eq: function () {
      return this
    },
    neq: function () {
      return this
    },
    gt: function () {
      return this
    },
    gte: function () {
      return this
    },
    lt: function () {
      return this
    },
    lte: function () {
      return this
    },
    like: function () {
      return this
    },
    ilike: function () {
      return this
    },
    is: function () {
      return this
    },
    in: function () {
      return this
    },
    contains: function () {
      return this
    },
    containedBy: function () {
      return this
    },
    rangeLt: function () {
      return this
    },
    rangeGte: function () {
      return this
    },
    rangeLte: function () {
      return this
    },
    rangeAdjacent: function () {
      return this
    },
    overlaps: function () {
      return this
    },
    textSearch: function () {
      return this
    },
    match: function () {
      return this
    },
    not: function () {
      return this
    },
    or: function () {
      return this
    },
    limit: function () {
      return this
    },
    offset: function () {
      return this
    },
    range: function () {
      return this
    },
    single: async () => ({ data: null, error: null }),
    maybeSingle: async () => ({ data: null, error: null }),
  }
}

function createMockClient() {
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      signInWithPassword: async () => ({ data: null, error: new Error("Supabase not configured") }),
      signUp: async () => ({ data: null, error: new Error("Supabase not configured") }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => ({
      select: () => createQueryBuilder(),
      insert: async () => ({ error: null }),
      update: async () => ({ error: null }),
      delete: async () => ({ error: null }),
      upsert: async () => ({ error: null }),
    }),
  } as any
}
