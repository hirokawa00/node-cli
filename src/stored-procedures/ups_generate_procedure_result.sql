CREATE OR REPLACE FUNCTION generate_procedure_result(
    status text,
    code text, 
    version text, 
    message text, 
    start_time timestamptz, 
    step text
)
RETURNS json AS $$
BEGIN
    RETURN json_build_object(
        'status', status,
        'code', code,
        'version', version,
        'message', message,
        'start_time', start_time,
        'end_time', clock_timestamp(),
        'duration_seconds', EXTRACT(EPOCH FROM (clock_timestamp() - start_time)),
        'step', step
    );
END;
$$ LANGUAGE plpgsql;