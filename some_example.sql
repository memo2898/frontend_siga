--
-- PostgreSQL database dump
--

-- Dumped from database version 14.10
-- Dumped by pg_dump version 16.0

-- Started on 2026-01-29 11:21:33 AST

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 216 (class 1259 OID 60189)
-- Name: departamentos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.departamentos (
    id integer NOT NULL,
    id_direccion integer NOT NULL,
    nombre_departamento character varying(255) NOT NULL,
    descripcion text,
    fecha_creacion date DEFAULT CURRENT_DATE,
    agregado_por character varying(100) NOT NULL,
    agregado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    actualizado_por character varying(100),
    actualizado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    estado character varying(20) DEFAULT 'activo'::character varying
);


ALTER TABLE public.departamentos OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 60188)
-- Name: departamentos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.departamentos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.departamentos_id_seq OWNER TO postgres;

--
-- TOC entry 3651 (class 0 OID 0)
-- Dependencies: 215
-- Name: departamentos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.departamentos_id_seq OWNED BY public.departamentos.id;


--
-- TOC entry 3497 (class 2604 OID 60192)
-- Name: departamentos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departamentos ALTER COLUMN id SET DEFAULT nextval('public.departamentos_id_seq'::regclass);


--
-- TOC entry 3645 (class 0 OID 60189)
-- Dependencies: 216
-- Data for Name: departamentos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.departamentos (id, id_direccion, nombre_departamento, descripcion, fecha_creacion, agregado_por, agregado_en, actualizado_por, actualizado_en, estado) FROM stdin;
1	1	Ayudas y Donaciones Programadas	Código: 000587 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
2	4	Auditoría de Gestión y Financiera	Código: 000406 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
3	4	Auditoría Técnica y Legal	Código: 000407 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
4	5	Relación y Cooperación Internacional	Código: 000437 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
5	6	Observatorio Ciudadano	Código: 000427 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
6	6	Coordinación del Plan Estratégico	Código: 000429 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
7	6	Oficina de Libre Acceso a la Información Pública	Código: 000432 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
8	7	Litígios	Código: 000089 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
9	7	Documentación Legal	Código: 000269 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
11	7	Gestión Inmobiliaria	Código: 000589 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
12	8	Revisión	Código: 000271 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
13	8	Operaciones	Código: 000411 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
14	8	Fiscalización de Obras	Código: 000412 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
15	9	Control y Verificación	Código: 000273 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
16	9	Tasación	Código: 000275 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
17	9	Planes y Normas	Código: 000279 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
18	9	Urbanismo	Código: 000417 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
19	10	Promoción Institucional	Código: 000280 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
20	10	Prensa	Código: 000281 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
21	10	Relaciones Públicas	Código: 000398 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
22	10	Comunicación Digital	Código: 000582 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
23	11	Contabilidad	Código: 000283 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
24	12	Investigaciones	Código: 000420 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
25	12	Logística	Código: 000421 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
26	12	Operaciones	Código: 000422 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
27	13	Compras	Código: 000291 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
28	13	Control de Bienes	Código: 000292 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
29	13	Gobernación	Código: 000414 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
30	14	Tramitación y Liquidación de Valores	Código: 000294 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
31	14	Archivo y Digitalización	Código: 000424 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
32	14	Inspección de Venta Condicionada	Código: 000425 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
33	14	Registro Contable	Código: 000426 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
34	15	Alumbrado Público	Código: 000297 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
35	15	Diseño de Obras	Código: 000394 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
36	15	Ejecución de Obras	Código: 000395 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
37	15	Embellecimiento Público	Código: 000396 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
38	15	Costo y Presupuesto de Obras	Código: 000397 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
39	16	Ejecución de Servicios de Tránsito y Movilidad Urbana	Código: 000305 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
40	16	Estudios Técnicos de la Movilidad Urbana	Código: 000307 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
41	16	Fiscalización y Permisos	Código: 000423 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
42	17	Juventud	Código: 000229 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
43	17	Juntas de Vecinos	Código: 000230 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
44	17	Acción Comunitaria	Código: 000233 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
45	17	Educación Ciudadana	Código: 000235 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
46	17	Atención Ciudadana	Código: 000236 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
47	17	Delegaciones	Código: 000249 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
48	18	Formación Técnico-Laboral	Código: 000309 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
49	18	Asistencia a Grupos Vulnerables	Código: 000315 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
50	18	Salud	Código: 000333 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
51	18	Departamento de Género	Código: 000376 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
52	18	Circunscripción I	Código: 000439 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
53	18	Circunscripción II	Código: 000440 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
54	18	Circunscripción III	Código: 000441 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
55	18	Inspección Social	Código: 000442 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
56	18	Funerarias	Código: 000444 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
57	19	Nómina	Código: 000195 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
58	19	Seguridad Social	Código: 000198 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
59	19	Relaciones Laborales	Código: 000199 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
60	19	Reclutamiento, Selección y Evaluación	Código: 000200 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
61	19	Capacitación	Código: 000383 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
62	19	Fondos de Pensionados y/o Jubilaciones	Código: 000435 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
63	19	Fondos de Beneficiarios Fallecidos	Código: 000436 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
64	20	Normas y Procesos	Código: 000222 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
65	20	Medición y Evaluación de Procesos	Código: 000413 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
66	21	Estadísticas	Código: 000224 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
67	21	Formulación Presupuestaria	Código: 000226 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
68	21	Planificación Estratégica	Código: 000399 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
69	21	Desarrollo Organizacional	Código: 000401 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
70	21	Ejecución Presupuestaria	Código: 000583 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
71	21	Calidad en la Gestión	Código: 000588 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
72	22	Inspección	Código: 000214 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
73	22	Atención al Contribuyente	Código: 000218 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
74	22	Facturación	Código: 000220 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
75	22	Cobranzas	Código: 000221 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
76	22	Catastro	Código: 000443 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
77	23	Calidad Ambiental y Prevención de la Contaminación	Código: 000201 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
78	23	Prevención y Reducción de la Vulnerabilidad	Código: 000202 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
79	23	Políticas y Planes Ambientales	Código: 000408 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
80	23	Gestión de Riesgos	Código: 000409 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
81	24	Aseo Urbano	Código: 000253 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
82	24	Equipos y Transporte	Código: 000255 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
83	24	Programación y Control	Código: 000418 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
84	24	Operaciones de Limpieza	Código: 000419 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
85	25	Recuperación de Espacios Públicos	Código: 000246 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
86	25	Descontaminación Visual	Código: 000403 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
87	26	Recuperación de Inmuebles	Código: 000243 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
88	26	Investigación Catastral y Mensura	Código: 000245 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
89	27	Regulación y Control del Patrimonio Cultural y Centro Histórico	Código: 000193 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
90	27	Centro Histórico	Código: 000240 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
91	28	Gestión de Proyectos	Código: 000239 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
92	28	Oficina de Libre Acceso a la Información Pública	Código: 000450 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
93	28	Coordinación del Plan Estratégico	Código: 000586 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
94	29	Cementerios	Código: 000347 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
95	29	Mercados	Código: 000354 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
96	30	Desarrollo de Aplicaciones	Código: 000415 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
97	30	Infraestructura Tecnológica	Código: 000416 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
98	31	Drenaje Pluvial	Código: 000301 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
99	31	Mantenimiento Vial	Código: 000385 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
100	31	Obras Comunitarias	Código: 000387 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
101	31	Mantenimiento de Plazas y Parques	Código: 000393 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
102	32	Animación Urbana	Código: 000227 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
103	32	Cultura	Código: 000430 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
104	32	Malecón	Código: 000449 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
105	33	Ingresos	Código: 000433 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
106	33	Egresos	Código: 000434 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	\N	2025-12-09 10:02:44.536991	active
107	3	gchgchg	kjbkjvj	2025-12-14	superadmin	2025-12-14 23:44:04.898517	\N	2025-12-14 23:44:04.898517	activo
108	4	hvhjvjh	hvjhvj	2025-12-14	superadmin	2025-12-14 23:44:24.825274	\N	2025-12-14 23:44:24.825274	activo
10	7	Cobros Compulsivos	Código: 000270 - Nivel: Departamento	2025-12-09	sistema	2025-12-09 10:02:44.536991	superadmin	2025-12-09 10:02:44.536991	active
109	4	sdfsdf	sdfsdf	2025-12-14	superadmin	2025-12-14 23:45:07.143456	\N	2025-12-14 23:45:07.143456	activo
110	4	asdasd	asdasd	2025-12-14	superadmin	2025-12-14 23:54:29.8579	\N	2025-12-14 23:54:29.8579	activo
111	2	put some text here	put some text here	2025-04-01	yo	2025-12-12 00:00:00	\N	2025-12-15 00:00:37.679017	put some text here
112	3	asdasd	asdasd	2025-12-15	superadmin	2025-12-15 00:00:58.89061	\N	2025-12-15 00:00:58.89061	activo
113	4	jhhj	jjhjh	2025-12-15	superadmin	2025-12-15 00:06:56.726713	\N	2025-12-15 00:06:56.726713	activo
\.


--
-- TOC entry 3652 (class 0 OID 0)
-- Dependencies: 215
-- Name: departamentos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.departamentos_id_seq', 113, true);


--
-- TOC entry 3503 (class 2606 OID 60200)
-- Name: departamentos departamentos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departamentos
    ADD CONSTRAINT departamentos_pkey PRIMARY KEY (id);


--
-- TOC entry 3504 (class 2606 OID 60413)
-- Name: departamentos fk_departamentos_direcciones; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departamentos
    ADD CONSTRAINT fk_departamentos_direcciones FOREIGN KEY (id_direccion) REFERENCES public.direcciones(id);


-- Completed on 2026-01-29 11:21:33 AST

--
-- PostgreSQL database dump complete
--

