DROP DATABASE IF EXISTS pos_app;
CREATE DATABASE pos_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pos_app;

create table article
(
    id          int auto_increment primary key,
    description varchar(255) not null,
    category    varchar(255) not null,
    code        varchar(255) null,
    barcode     varchar(13)  null,
    price       float        not null,
    cost        float        null,
    stock       float        null,
    constraint barcode
        unique (barcode),
    constraint code
        unique (code)
);
