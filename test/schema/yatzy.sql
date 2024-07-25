--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.3

-- Started on 2024-07-24 20:10:29

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
-- TOC entry 4864 (class 1262 OID 16398)
-- Name: yatzy; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE yatzy WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_Canada.1252';


ALTER DATABASE yatzy OWNER TO postgres;

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
-- TOC entry 4865 (class 0 OID 0)
-- Dependencies: 4864
-- Name: DATABASE yatzy; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON DATABASE yatzy IS 'Database for Yatzy web app project';


--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 4866 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 16416)
-- Name: account_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account_types (
    type_id integer NOT NULL,
    type_desc text NOT NULL
);


ALTER TABLE public.account_types OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16415)
-- Name: account_types_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.account_types_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.account_types_type_id_seq OWNER TO postgres;

--
-- TOC entry 4867 (class 0 OID 0)
-- Dependencies: 219
-- Name: account_types_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.account_types_type_id_seq OWNED BY public.account_types.type_id;


--
-- TOC entry 216 (class 1259 OID 16400)
-- Name: scores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.scores (
    id integer NOT NULL,
    score integer NOT NULL,
    date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.scores OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16399)
-- Name: scores_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.scores_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.scores_id_seq OWNER TO postgres;

--
-- TOC entry 4868 (class 0 OID 0)
-- Dependencies: 215
-- Name: scores_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.scores_id_seq OWNED BY public.scores.id;


--
-- TOC entry 218 (class 1259 OID 16407)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    username text NOT NULL,
    first_name text NOT NULL,
    last_name text,
    password text NOT NULL,
    "position" point NOT NULL,
    type_id integer NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16406)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;

--
-- TOC entry 4869 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- TOC entry 4701 (class 2604 OID 16419)
-- Name: account_types type_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_types ALTER COLUMN type_id SET DEFAULT nextval('public.account_types_type_id_seq'::regclass);


--
-- TOC entry 4698 (class 2604 OID 16403)
-- Name: scores id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scores ALTER COLUMN id SET DEFAULT nextval('public.scores_id_seq'::regclass);


--
-- TOC entry 4700 (class 2604 OID 16410)
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- TOC entry 4858 (class 0 OID 16416)
-- Dependencies: 220
-- Data for Name: account_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.account_types VALUES (1, 'admin');
INSERT INTO public.account_types VALUES (2, 'player');


--
-- TOC entry 4854 (class 0 OID 16400)
-- Dependencies: 216
-- Data for Name: scores; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.scores VALUES (1, 300, '2024-07-24 20:08:14.717115', 1);
INSERT INTO public.scores VALUES (2, 100, '2024-07-24 20:08:14.717115', 4);
INSERT INTO public.scores VALUES (3, 500, '2024-07-24 20:08:14.717115', 3);
INSERT INTO public.scores VALUES (4, 200, '2024-07-24 20:08:14.717115', 2);
INSERT INTO public.scores VALUES (5, 100, '2024-07-24 20:08:14.717115', 1);
INSERT INTO public.scores VALUES (6, 361, '2024-07-24 20:08:14.717115', 4);
INSERT INTO public.scores VALUES (7, 182, '2024-07-24 20:08:14.717115', 3);
INSERT INTO public.scores VALUES (8, 500, '2024-07-24 20:08:14.717115', 3);
INSERT INTO public.scores VALUES (9, 1000, '2024-07-24 20:08:14.717115', 4);
INSERT INTO public.scores VALUES (10, 2678, '2024-07-24 20:08:14.717115', 4);
INSERT INTO public.scores VALUES (11, 251, '2024-07-24 20:08:14.717115', 3);
INSERT INTO public.scores VALUES (12, 1910, '2024-07-24 20:08:14.717115', 2);
INSERT INTO public.scores VALUES (13, 384, '2024-07-24 20:08:14.717115', 2);


--
-- TOC entry 4856 (class 0 OID 16407)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users VALUES (1, 'yatzia', 'julia', 'bootsma', '12345', '(0,0)', 1);
INSERT INTO public.users VALUES (2, 'toriwu', 'tori', NULL, '54321', '(1,1)', 1);
INSERT INTO public.users VALUES (3, 'superyatzy', 'John', 'Hasbro', 'yahtzee', '(0,1)', 2);
INSERT INTO public.users VALUES (4, 'diceguy', 'Milton', 'Bradley', 'dice', '(1,0)', 2);


--
-- TOC entry 4870 (class 0 OID 0)
-- Dependencies: 219
-- Name: account_types_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.account_types_type_id_seq', 2, true);


--
-- TOC entry 4871 (class 0 OID 0)
-- Dependencies: 215
-- Name: scores_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.scores_id_seq', 13, true);


--
-- TOC entry 4872 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 4, true);


--
-- TOC entry 4707 (class 2606 OID 16423)
-- Name: account_types account_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_types
    ADD CONSTRAINT account_types_pkey PRIMARY KEY (type_id);


--
-- TOC entry 4703 (class 2606 OID 16405)
-- Name: scores scores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scores
    ADD CONSTRAINT scores_pkey PRIMARY KEY (id);


--
-- TOC entry 4705 (class 2606 OID 16414)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4709 (class 2606 OID 16424)
-- Name: users type_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT type_id FOREIGN KEY (type_id) REFERENCES public.account_types(type_id) NOT VALID;


--
-- TOC entry 4708 (class 2606 OID 16429)
-- Name: scores user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scores
    ADD CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES public.users(user_id) NOT VALID;


-- Completed on 2024-07-24 20:10:29

--
-- PostgreSQL database dump complete
--

