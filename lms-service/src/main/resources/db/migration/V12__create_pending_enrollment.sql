CREATE TABLE pending_enrollment
(
    id         BIGINT IDENTITY(1,1) PRIMARY KEY,
    txn_ref    NVARCHAR(100) NOT NULL UNIQUE,
    user_id    BIGINT         NOT NULL,
    program_id BIGINT NULL,
    subject_id BIGINT NULL,
    total_fee  DECIMAL(18, 2) NOT NULL,
    amount     DECIMAL(18, 2) NOT NULL,
    status     NVARCHAR(20) NOT NULL, -- PENDING, SUCCESS, FAILED, CANCELLED
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 NULL
);
