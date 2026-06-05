export type SendTransactionalEmailPayload = {
    event_type: string
    to_email: string
    to_name?: string | null
    variables?: Record<string, unknown>
    metadata?: Record<string, unknown>
    history_id?: string
}

export type SendTransactionalEmailResult = {
    success: boolean
    message?: string
    history_id?: string
    status?: string
    provider_message_id?: string | null
}
