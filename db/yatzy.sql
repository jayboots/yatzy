--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.3

-- Started on 2024-08-04 00:23:45

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE IF EXISTS yatzy;
--
-- TOC entry 4875 (class 1262 OID 16398)
-- Name: yatzy; Type: DATABASE; Schema: -; Owner: -
--

CREATE DATABASE yatzy WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_Canada.1252';


\connect yatzy

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4876 (class 0 OID 0)
-- Dependencies: 4875
-- Name: DATABASE yatzy; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON DATABASE yatzy IS 'Database for Yatzy web app project';


--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- TOC entry 4877 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 16416)
-- Name: account_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.account_types (
    type_id integer NOT NULL,
    type_desc text NOT NULL
);


--
-- TOC entry 219 (class 1259 OID 16415)
-- Name: account_types_type_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.account_types_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4878 (class 0 OID 0)
-- Dependencies: 219
-- Name: account_types_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.account_types_type_id_seq OWNED BY public.account_types.type_id;


--
-- TOC entry 221 (class 1259 OID 16435)
-- Name: regions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.regions (
    region_id integer DEFAULT nextval('public.account_types_type_id_seq'::regclass) NOT NULL,
    region_name text NOT NULL
);


--
-- TOC entry 216 (class 1259 OID 16400)
-- Name: scores; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.scores (
    id integer NOT NULL,
    score integer NOT NULL,
    date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id integer NOT NULL
);


--
-- TOC entry 215 (class 1259 OID 16399)
-- Name: scores_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.scores_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4879 (class 0 OID 0)
-- Dependencies: 215
-- Name: scores_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.scores_id_seq OWNED BY public.scores.id;


--
-- TOC entry 218 (class 1259 OID 16407)
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    username text NOT NULL,
    first_name text NOT NULL,
    last_name text,
    password text NOT NULL,
    type_id integer DEFAULT 2 NOT NULL,
    region_id integer
);


--
-- TOC entry 217 (class 1259 OID 16406)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4880 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- TOC entry 4706 (class 2604 OID 16419)
-- Name: account_types type_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account_types ALTER COLUMN type_id SET DEFAULT nextval('public.account_types_type_id_seq'::regclass);


--
-- TOC entry 4702 (class 2604 OID 16403)
-- Name: scores id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scores ALTER COLUMN id SET DEFAULT nextval('public.scores_id_seq'::regclass);


--
-- TOC entry 4704 (class 2604 OID 16410)
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- TOC entry 4868 (class 0 OID 16416)
-- Dependencies: 220
-- Data for Name: account_types; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.account_types (type_id, type_desc) VALUES (1, 'admin');
INSERT INTO public.account_types (type_id, type_desc) VALUES (2, 'player');


--
-- TOC entry 4869 (class 0 OID 16435)
-- Dependencies: 221
-- Data for Name: regions; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.regions (region_id, region_name) VALUES (3, 'Africa');
INSERT INTO public.regions (region_id, region_name) VALUES (4, 'South America');
INSERT INTO public.regions (region_id, region_name) VALUES (5, 'Oceania');
INSERT INTO public.regions (region_id, region_name) VALUES (6, 'Europe');
INSERT INTO public.regions (region_id, region_name) VALUES (7, 'Asia');
INSERT INTO public.regions (region_id, region_name) VALUES (8, 'Antarctica');
INSERT INTO public.regions (region_id, region_name) VALUES (9, 'North America');


--
-- TOC entry 4864 (class 0 OID 16400)
-- Dependencies: 216
-- Data for Name: scores; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.scores (id, score, date, user_id) VALUES (1, 300, '2024-07-24 20:08:14.717115', 1);
INSERT INTO public.scores (id, score, date, user_id) VALUES (3, 500, '2024-07-24 20:08:14.717115', 3);
INSERT INTO public.scores (id, score, date, user_id) VALUES (4, 200, '2024-07-24 20:08:14.717115', 2);
INSERT INTO public.scores (id, score, date, user_id) VALUES (6, 361, '2024-07-24 20:08:14.717115', 4);
INSERT INTO public.scores (id, score, date, user_id) VALUES (7, 182, '2024-07-24 20:08:14.717115', 3);
INSERT INTO public.scores (id, score, date, user_id) VALUES (8, 500, '2024-07-24 20:08:14.717115', 3);
INSERT INTO public.scores (id, score, date, user_id) VALUES (9, 1000, '2024-07-24 20:08:14.717115', 4);
INSERT INTO public.scores (id, score, date, user_id) VALUES (10, 2678, '2024-07-24 20:08:14.717115', 4);
INSERT INTO public.scores (id, score, date, user_id) VALUES (11, 251, '2024-07-24 20:08:14.717115', 3);
INSERT INTO public.scores (id, score, date, user_id) VALUES (12, 1910, '2024-07-24 20:08:14.717115', 2);
INSERT INTO public.scores (id, score, date, user_id) VALUES (13, 384, '2024-07-24 20:08:14.717115', 2);
INSERT INTO public.scores (id, score, date, user_id) VALUES (14, 500, '2024-07-30 23:29:26.104465', 1);
INSERT INTO public.scores (id, score, date, user_id) VALUES (15, 9999999, '2024-07-30 23:45:04.591743', 3);
INSERT INTO public.scores (id, score, date, user_id) VALUES (16, 9999999, '2024-07-31 00:06:42.205906', 3);
INSERT INTO public.scores (id, score, date, user_id) VALUES (17, 9999999, '2024-07-31 00:07:08.726884', 3);
INSERT INTO public.scores (id, score, date, user_id) VALUES (18, 9999999, '2024-07-31 00:13:35.530397', 3);
INSERT INTO public.scores (id, score, date, user_id) VALUES (19, 9999999, '2024-07-31 00:13:46.348012', 3);
INSERT INTO public.scores (id, score, date, user_id) VALUES (20, 9999999, '2024-07-31 00:17:40.593092', 3);
INSERT INTO public.scores (id, score, date, user_id) VALUES (21, 9999999, '2024-07-31 00:23:32.953717', 3);
INSERT INTO public.scores (id, score, date, user_id) VALUES (22, 9999999, '2024-07-31 00:23:35.232017', 3);
INSERT INTO public.scores (id, score, date, user_id) VALUES (23, 9999999, '2024-07-31 00:23:40.748995', 3);
INSERT INTO public.scores (id, score, date, user_id) VALUES (24, 9999999, '2024-07-31 00:23:50.89359', 3);
INSERT INTO public.scores (id, score, date, user_id) VALUES (25, 100, '2024-07-31 00:29:40.150556', 3);
INSERT INTO public.scores (id, score, date, user_id) VALUES (26, 100, '2024-07-31 00:32:17.050747', 3);
INSERT INTO public.scores (id, score, date, user_id) VALUES (27, 100, '2024-07-31 00:35:19.70035', 3);
INSERT INTO public.scores (id, score, date, user_id) VALUES (28, 100, '2024-07-31 00:37:16.294329', 3);
INSERT INTO public.scores (id, score, date, user_id) VALUES (30, 100, '2024-07-31 00:37:39.997221', 3);
INSERT INTO public.scores (id, score, date, user_id) VALUES (31, 100, '2024-07-31 00:37:54.484224', 3);
INSERT INTO public.scores (id, score, date, user_id) VALUES (32, 100, '2024-07-31 00:38:03.300473', 3);
INSERT INTO public.scores (id, score, date, user_id) VALUES (33, 100, '2024-07-31 00:38:13.683016', 3);
INSERT INTO public.scores (id, score, date, user_id) VALUES (34, 120, '2024-07-31 00:58:31.227103', 2);
INSERT INTO public.scores (id, score, date, user_id) VALUES (35, 120, '2024-07-31 00:59:05.383416', 2);
INSERT INTO public.scores (id, score, date, user_id) VALUES (36, 120, '2024-07-31 00:59:09.712014', 2);
INSERT INTO public.scores (id, score, date, user_id) VALUES (37, 120, '2024-07-31 00:59:27.988425', 2);
INSERT INTO public.scores (id, score, date, user_id) VALUES (38, 120, '2024-07-31 00:59:46.016017', 2);
INSERT INTO public.scores (id, score, date, user_id) VALUES (39, 120, '2024-07-31 01:00:03.818666', 2);
INSERT INTO public.scores (id, score, date, user_id) VALUES (40, 120, '2024-07-31 01:00:32.813054', 2);
INSERT INTO public.scores (id, score, date, user_id) VALUES (41, 120, '2024-07-31 01:01:58.905629', 2);
INSERT INTO public.scores (id, score, date, user_id) VALUES (46, 195, '2024-08-03 01:03:24.583154', 1);


--
-- TOC entry 4866 (class 0 OID 16407)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.users (user_id, username, first_name, last_name, password, type_id, region_id) VALUES (3, 'superyatzy', 'John', 'Hasbro', 'yahtzee', 2, 5);
INSERT INTO public.users (user_id, username, first_name, last_name, password, type_id, region_id) VALUES (4, 'diceguy', 'Milton', 'Bradley', 'dice', 2, 8);
INSERT INTO public.users (user_id, username, first_name, last_name, password, type_id, region_id) VALUES (12, 'supercaps', 'Hullaberry', 'Yatzyman', '342474', 2, NULL);
INSERT INTO public.users (user_id, username, first_name, last_name, password, type_id, region_id) VALUES (1, 'yatzia', 'Yulia', 'Boersma', '12345', 1, 9);
INSERT INTO public.users (user_id, username, first_name, last_name, password, type_id, region_id) VALUES (2, 'toriwu', 'Tori', NULL, '54321', 1, 9);


--
-- TOC entry 4881 (class 0 OID 0)
-- Dependencies: 219
-- Name: account_types_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.account_types_type_id_seq', 9, true);


--
-- TOC entry 4882 (class 0 OID 0)
-- Dependencies: 215
-- Name: scores_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.scores_id_seq', 52, true);


--
-- TOC entry 4883 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_user_id_seq', 24, true);


--
-- TOC entry 4715 (class 2606 OID 16423)
-- Name: account_types account_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account_types
    ADD CONSTRAINT account_types_pkey PRIMARY KEY (type_id);


--
-- TOC entry 4717 (class 2606 OID 16441)
-- Name: regions regions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.regions
    ADD CONSTRAINT regions_pkey PRIMARY KEY (region_id);


--
-- TOC entry 4709 (class 2606 OID 16405)
-- Name: scores scores_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scores
    ADD CONSTRAINT scores_pkey PRIMARY KEY (id);


--
-- TOC entry 4711 (class 2606 OID 16445)
-- Name: users unique_user; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT unique_user UNIQUE (username) INCLUDE (username);


--
-- TOC entry 4713 (class 2606 OID 16414)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4718 (class 2606 OID 24576)
-- Name: scores fk_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scores
    ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4719 (class 2606 OID 16424)
-- Name: users type_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT type_id FOREIGN KEY (type_id) REFERENCES public.account_types(type_id) NOT VALID;


-- Completed on 2024-08-04 00:23:45

--
-- PostgreSQL database dump complete
--

