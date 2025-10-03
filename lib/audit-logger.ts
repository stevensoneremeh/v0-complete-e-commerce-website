import { createClient } from "@/lib/supabase/server"

export interface AuditLogEntry {
  action: "CREATE" | "UPDATE" | "DELETE" | "APPROVE" | "REJECT" | "EXPORT" | "BULK_UPDATE"
  tableName: string
  recordId?: string
  oldData?: Record<string, any>
  newData?: Record<string, any>
  details?: Record<string, any>
  ipAddress?: string
  userAgent?: string
}

export async function logAdminAction(entry: AuditLogEntry) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("audit_logs")
    .insert({
      action: entry.action,
      table_name: entry.tableName,
      record_id: entry.recordId,
      old_data: entry.oldData,
      new_data: entry.newData,
      details: entry.details,
      ip_address: entry.ipAddress,
      user_agent: entry.userAgent,
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Failed to log admin action:", error)
    return null
  }

  return data
}

export async function getAuditLogs(filters?: {
  actorId?: string
  tableName?: string
  action?: string
  startDate?: Date
  endDate?: Date
  limit?: number
  offset?: number
}) {
  const supabase = await createClient()

  let query = supabase
    .from("audit_logs")
    .select(`
      *,
      profiles:actor_id (
        full_name,
        email
      )
    `)
    .order("created_at", { ascending: false })

  if (filters?.actorId) {
    query = query.eq("actor_id", filters.actorId)
  }

  if (filters?.tableName) {
    query = query.eq("table_name", filters.tableName)
  }

  if (filters?.action) {
    query = query.eq("action", filters.action)
  }

  if (filters?.startDate) {
    query = query.gte("created_at", filters.startDate.toISOString())
  }

  if (filters?.endDate) {
    query = query.lte("created_at", filters.endDate.toISOString())
  }

  if (filters?.limit) {
    query = query.limit(filters.limit)
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1)
  }

  const { data, error } = await query

  if (error) {
    console.error("[v0] Failed to fetch audit logs:", error)
    return []
  }

  return data
}
