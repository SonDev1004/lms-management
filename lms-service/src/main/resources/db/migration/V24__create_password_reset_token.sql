create table password_reset_token (
                                      id bigint identity(1,1) primary key,
                                      user_id bigint not null,
                                      token_hash varchar(128) not null,
                                      expires_at datetime2 not null,
                                      used bit not null default 0,
                                      created_at datetime2 not null default sysdatetime(),
                                      used_at datetime2 null,
                                      constraint fk_prt_user foreign key(user_id) references [user](id)
);

create unique index ux_prt_token_hash on password_reset_token(token_hash);
create index ix_prt_user_id on password_reset_token(user_id);
create index ix_prt_expires on password_reset_token(expires_at);
