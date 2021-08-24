CREATE SEQUENCE userinfos_user_id_seq
				start 1000
				increment 10;

CREATE TABLE userinfos(
    user_id integer NOT NULL DEFAULT nextval('userinfos_user_id_seq'),
    email character varying(255) COLLATE pg_catalog."default",
    password character varying(255) COLLATE pg_catalog."default",
    "passwordCheck" character varying(255) COLLATE pg_catalog."default",
    "displayName" character varying(255) COLLATE pg_catalog."default",
    "createdAt" TEXT DEFAULT to_char(now(), 'dd/mm/yyyy'),
    "updatedAt" timestamp with time zone NOT NULL,
    PRIMARY KEY (user_id)
);


CREATE SEQUENCE car_car_id_seq
				start 100
				increment 50;
CREATE TABLE car
(
    car_id integer NOT NULL DEFAULT nextval('car_car_id_seq'),
    model character varying ,
    make character varying ,
    mileage character varying,
    year character varying ,
    price character varying ,
    user_id integer ,
    PRIMARY KEY (car_id),
    FOREIGN KEY (user_id) REFERENCES userinfos(user_id)
);


