CREATE OR REPLACE FUNCTION dry_run_execute_procedure(procedure_name text)
RETURNS json AS $$
DECLARE
    result json;
    version text := '1.0.0';
    start_time timestamptz := clock_timestamp();
    step text := 'Starting DryRun procedure';
    procedure_exists boolean;
BEGIN
    -- ステップ2: 実際のデータ変更を行わないDryRun処理のシミュレーション
    step := 'Simulating procedure';
    RAISE INFO 'Simulating procedure'
    -- プロシージャが存在するかを確認
    SELECT EXISTS (
        SELECT 1 
        FROM pg_proc 
        WHERE proname = procedure_name
    ) INTO procedure_exists;

    -- プロシージャが存在しない場合は例外を発生させる
    IF NOT procedure_exists THEN
        RAISE EXCEPTION 'Procedure % does not exist', procedure_name;
    END IF;

    -- ステップ3: 結果を生成
    step := 'Generating result';
    -- DryRun処理の内容をJSON形式で返却
    result := generate_procedure_result(
        'success',
        '0', 
        version, 
        format('DryRun: Procedure %s would have been processed', procedure_name),
        start_time,
        step
    );

    RETURN result;

EXCEPTION
    -- 例外処理
    WHEN OTHERS THEN
        result := generate_procedure_result(
            'error',
            SQLSTATE,
            version,
            format('Error processing procedure %s: %s (SQLSTATE: %s)', procedure_name, SQLERRM, SQLSTATE),
            start_time,
            step
        );
            -- エラーの内容をログに残す
        RAISE NOTICE 'Error in procedure: %', result;
        -- エラーを再スロー（元の例外を再発生させる）
        RAISE;
END;
$$ LANGUAGE plpgsql;
