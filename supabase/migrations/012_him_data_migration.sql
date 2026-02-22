-- ============================================================================
-- HEARTFELT INTERNATIONAL MINISTRIES
-- Complete Data Migration - Production Safe Format
-- Run in Supabase SQL Editor
-- ============================================================================

-- Disable RLS for migration
ALTER TABLE regions DISABLE ROW LEVEL SECURITY;
ALTER TABLE zones DISABLE ROW LEVEL SECURITY;
ALTER TABLE pastors DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- REGIONS DATA
-- ============================================================================
INSERT INTO regions (region_code, name, country, description) VALUES
('01', 'IOC', 'Zimbabwe', 'IOC Region'),
('02', 'Marndra (Rsk)', 'Zimbabwe', 'Marndra Region'),
('03', 'Ruwa', 'Zimbabwe', 'Ruwa Region'),
('04', 'Zengeza', 'Zimbabwe', 'Zengeza Region'),
('05', 'Epworth', 'Zimbabwe', 'Epworth Region'),
('06', 'Mufakose', 'Zimbabwe', 'Mufakose Region'),
('07', 'Southlea Park', 'Zimbabwe', 'Southlea Park Region'),
('08', 'Glen View', 'Zimbabwe', 'Glen View Region'),
('09', 'Hatcliff', 'Zimbabwe', 'Hatcliff Region'),
('10', 'Waverly', 'Zimbabwe', 'Waverly Region'),
('11', 'Kwekwe City', 'Zimbabwe', 'Kwekwe City Region'),
('12', 'Chipadze', 'Zimbabwe', 'Chipadze Region'),
('13', 'Mutawatawa', 'Zimbabwe', 'Mutawatawa Region'),
('14', 'St Ives', 'Zimbabwe', 'St Ives Region'),
('15', 'International', 'International', 'International Region'),
('16', 'Zvishavane', 'Zimbabwe', 'Zvishavane Region'),
('17', 'Kempton Park', 'South Africa', 'Kempton Park Region'),
('18', 'Nkulumane', 'Zimbabwe', 'Nkulumane Region'),
('19', 'Tete', 'Mozambique', 'Tete Region'),
('20', 'Gwanda', 'Zimbabwe', 'Gwanda Region'),
('21', 'Mutare', 'Zimbabwe', 'Mutare Region'),
('22', 'Gweru City', 'Zimbabwe', 'Gweru City Region')
ON CONFLICT (region_code) DO NOTHING;

-- ============================================================================
-- ZONES DATA
-- ============================================================================

-- Region 01 - IOC
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '01', 'R0101', 'Dzivarasekwa', 'Harare' FROM regions r WHERE r.region_code = '01' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '02', 'R0102', 'Wedza', 'Wedza' FROM regions r WHERE r.region_code = '01' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '03', 'R0103', 'Nyameni', 'Nyameni' FROM regions r WHERE r.region_code = '01' ON CONFLICT DO NOTHING;

-- Region 02 - Marndra
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '01', 'R0201', 'Marndra', 'Marndra' FROM regions r WHERE r.region_code = '02' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '02', 'R0202', 'Nyameni', 'Nyameni' FROM regions r WHERE r.region_code = '02' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '03', 'R0203', 'Wedza', 'Wedza' FROM regions r WHERE r.region_code = '02' ON CONFLICT DO NOTHING;

-- Region 03 - Ruwa
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '01', 'R0301', 'Ruwa', 'Ruwa' FROM regions r WHERE r.region_code = '03' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '02', 'R0302', 'Damofalls', 'Damofalls' FROM regions r WHERE r.region_code = '03' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '03', 'R0303', 'Eastview', 'Eastview' FROM regions r WHERE r.region_code = '03' ON CONFLICT DO NOTHING;

-- Region 04 - Zengeza
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '01', 'R0401', 'Zengeza', 'Chitungwiza' FROM regions r WHERE r.region_code = '04' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '02', 'R0402', 'Seke', 'Chitungwiza' FROM regions r WHERE r.region_code = '04' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '03', 'R0403', 'St Marys', 'Chitungwiza' FROM regions r WHERE r.region_code = '04' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '04', 'R0404', 'Dema', 'Dema' FROM regions r WHERE r.region_code = '04' ON CONFLICT DO NOTHING;

-- Region 05 - Epworth
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '01', 'R0501', 'Epworth', 'Epworth' FROM regions r WHERE r.region_code = '05' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '02', 'R0502', 'Greendale', 'Greendale' FROM regions r WHERE r.region_code = '05' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '03', 'R0503', 'Mabvuku', 'Mabvuku' FROM regions r WHERE r.region_code = '05' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '04', 'R0504', 'Chabwino', 'Chabwino' FROM regions r WHERE r.region_code = '05' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '05', 'R0505', 'Chikurubi', 'Chikurubi' FROM regions r WHERE r.region_code = '05' ON CONFLICT DO NOTHING;

-- Region 06 - Mufakose
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '01', 'R0601', 'Mufakose', 'Harare' FROM regions r WHERE r.region_code = '06' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '02', 'R0602', 'Norton', 'Norton' FROM regions r WHERE r.region_code = '06' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '03', 'R0603', 'Kuwadzana', 'Harare' FROM regions r WHERE r.region_code = '06' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '04', 'R0604', 'Granary', 'Granary' FROM regions r WHERE r.region_code = '06' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '05', 'R0605', 'Kambuzuma', 'Harare' FROM regions r WHERE r.region_code = '06' ON CONFLICT DO NOTHING;

-- Region 07 - Southlea Park
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '01', 'R0701', 'Southlea Park', 'Harare' FROM regions r WHERE r.region_code = '07' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '02', 'R0702', 'Retreat', 'Retreat' FROM regions r WHERE r.region_code = '07' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '03', 'R0703', 'Hopely', 'Hopely' FROM regions r WHERE r.region_code = '07' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '04', 'R0704', 'Stoneridge', 'Stoneridge' FROM regions r WHERE r.region_code = '07' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '05', 'R0705', 'Fidelity', 'Fidelity' FROM regions r WHERE r.region_code = '07' ON CONFLICT DO NOTHING;

-- Region 08 - Glen View
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '01', 'R0801', 'Glen View', 'Harare' FROM regions r WHERE r.region_code = '08' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '02', 'R0802', 'Glen Norah', 'Harare' FROM regions r WHERE r.region_code = '08' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '03', 'R0803', 'Budiriro', 'Harare' FROM regions r WHERE r.region_code = '08' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '04', 'R0804', 'Highfields', 'Harare' FROM regions r WHERE r.region_code = '08' ON CONFLICT DO NOTHING;

-- Region 09 - Hatcliff
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '01', 'R0901', 'Hatcliff', 'Harare' FROM regions r WHERE r.region_code = '09' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '02', 'R0902', 'Domboshava', 'Domboshava' FROM regions r WHERE r.region_code = '09' ON CONFLICT DO NOTHING;

-- Region 10 - Waverly
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '01', 'R1001', 'Rimuka', 'Rimuka' FROM regions r WHERE r.region_code = '10' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '02', 'R1002', 'Chegutu', 'Chegutu' FROM regions r WHERE r.region_code = '10' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '03', 'R1003', 'Turf', 'Turf' FROM regions r WHERE r.region_code = '10' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '04', 'R1004', 'Ingezi', 'Ingezi' FROM regions r WHERE r.region_code = '10' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '05', 'R1005', 'Nembudziya', 'Nembudziya' FROM regions r WHERE r.region_code = '10' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '06', 'R1006', 'Waverly', 'Waverly' FROM regions r WHERE r.region_code = '10' ON CONFLICT DO NOTHING;

-- Region 11 - Kwekwe City
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '01', 'R1101', 'Mbizo', 'Kwekwe' FROM regions r WHERE r.region_code = '11' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '02', 'R1102', 'Gokwe', 'Gokwe' FROM regions r WHERE r.region_code = '11' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '03', 'R1103', 'Kwekwe City', 'Kwekwe' FROM regions r WHERE r.region_code = '11' ON CONFLICT DO NOTHING;

-- Region 12 - Chipadze
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '01', 'R1201', 'Chipadze', 'Bindura' FROM regions r WHERE r.region_code = '12' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '02', 'R1202', 'Glendale', 'Glendale' FROM regions r WHERE r.region_code = '12' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '03', 'R1203', 'Mvurwi', 'Mvurwi' FROM regions r WHERE r.region_code = '12' ON CONFLICT DO NOTHING;

-- Region 13 - Mutawatawa
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '01', 'R1301', 'Mutawatawa', 'Mutawatawa' FROM regions r WHERE r.region_code = '13' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '02', 'R1302', 'Murewa', 'Murewa' FROM regions r WHERE r.region_code = '13' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '03', 'R1303', 'Mutoko', 'Mutoko' FROM regions r WHERE r.region_code = '13' ON CONFLICT DO NOTHING;

-- Region 14 - St Ives
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '01', 'R1401', 'St Ives', 'St Ives' FROM regions r WHERE r.region_code = '14' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '02', 'R1402', 'Karoi', 'Karoi' FROM regions r WHERE r.region_code = '14' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '03', 'R1403', 'Chinhoi City', 'Chinhoi' FROM regions r WHERE r.region_code = '14' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '04', 'R1404', 'Kariba', 'Kariba' FROM regions r WHERE r.region_code = '14' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '05', 'R1405', 'Banket', 'Banket' FROM regions r WHERE r.region_code = '14' ON CONFLICT DO NOTHING;

-- Region 15 - International
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '01', 'R1501', 'UAE', 'UAE' FROM regions r WHERE r.region_code = '15' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '02', 'R1502', 'USA', 'USA' FROM regions r WHERE r.region_code = '15' ON CONFLICT DO NOTHING;

-- Region 16 - Zvishavane
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '01', 'R1601', 'Zvishavane', 'Zvishavane' FROM regions r WHERE r.region_code = '16' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '02', 'R1602', 'Masvingo', 'Masvingo' FROM regions r WHERE r.region_code = '16' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '03', 'R1603', 'Beitbridge', 'Beitbridge' FROM regions r WHERE r.region_code = '16' ON CONFLICT DO NOTHING;

-- Region 17 - Kempton Park
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '01', 'R1701', 'Kempton Park', 'Kempton Park' FROM regions r WHERE r.region_code = '17' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '02', 'R1702', 'Johannesburg', 'Johannesburg' FROM regions r WHERE r.region_code = '17' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '03', 'R1703', 'Pretoria', 'Pretoria' FROM regions r WHERE r.region_code = '17' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '04', 'R1704', 'Germiston', 'Germiston' FROM regions r WHERE r.region_code = '17' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '05', 'R1705', 'Cape Town', 'Cape Town' FROM regions r WHERE r.region_code = '17' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '06', 'R1706', 'Maputo', 'Maputo' FROM regions r WHERE r.region_code = '17' ON CONFLICT DO NOTHING;

-- Region 18 - Nkulumane
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '01', 'R1801', 'Nkulumane', 'Bulawayo' FROM regions r WHERE r.region_code = '18' ON CONFLICT DO NOTHING;

-- Region 19 - Tete
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '01', 'R1901', 'Tete', 'Tete' FROM regions r WHERE r.region_code = '19' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '02', 'R1902', 'Malawi', 'Malawi' FROM regions r WHERE r.region_code = '19' ON CONFLICT DO NOTHING;

-- Region 20 - Gwanda
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '01', 'R2001', 'Makwe', 'Makwe' FROM regions r WHERE r.region_code = '20' ON CONFLICT DO NOTHING;

-- Region 21 - Mutare
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '01', 'R2101', 'Chikanga', 'Mutare' FROM regions r WHERE r.region_code = '21' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '02', 'R2102', 'Dangamvura', 'Mutare' FROM regions r WHERE r.region_code = '21' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '03', 'R2103', 'Rusape', 'Rusape' FROM regions r WHERE r.region_code = '21' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '04', 'R2104', 'Manica', 'Manica' FROM regions r WHERE r.region_code = '21' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '05', 'R2105', 'Chimoio', 'Chimoio' FROM regions r WHERE r.region_code = '21' ON CONFLICT DO NOTHING;

-- Region 22 - Gweru City
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '01', 'R2201', 'Mkoba', 'Gweru' FROM regions r WHERE r.region_code = '22' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '02', 'R2202', 'Shurugwi', 'Shurugwi' FROM regions r WHERE r.region_code = '22' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '03', 'R2203', 'Senga', 'Senga' FROM regions r WHERE r.region_code = '22' ON CONFLICT DO NOTHING;
INSERT INTO zones (region_id, zone_code, full_code, name, city) SELECT r.id, '04', 'R2204', 'Gweru City', 'Gweru' FROM regions r WHERE r.region_code = '22' ON CONFLICT DO NOTHING;

-- ============================================================================
-- PASTORS DATA - Using your exact schema format
-- Auto-links zone_id using LEFT(pastor_code, 5)
-- ============================================================================

INSERT INTO pastors (
    pastor_code,
    full_name,
    zone_id,
    created_at,
    date_of_birth,
    gender,
    qr_code_url,
    is_active
)
SELECT 
    data.pastor_code,
    data.full_name,
    z.id,
    NOW(),
    NULL,
    NULL,
    NULL,
    TRUE
FROM (
VALUES
-- REGION 01
('R0101P01','Pastor Cee'),
('R0102P01','Pastor Mtombeni E'),
('R0102P02','Pastor Mtombeni M'),
('R0103P01','Pastor Chonzi M'),
('R0103P02','Pastor Chonzi (L)'),

-- REGION 02
('R0201P01','Pastor Chari'),
('R0201P02','Pastor Chari T'),
('R0202P01','Pastor Tonderai'),

-- REGION 03
('R0301P01','Pastor Kunaka'),
('R0301P02','Pastor Kunaka P'),
('R0302P01','Pastor Dzikiti'),
('R0302P02','Pastor Dzikiti (L)'),
('R0303P01','Pastor Lorraine'),

-- REGION 04
('R0401P01','Pastor Chonzi B'),
('R0401P02','Pastor Chonzi L'),
('R0402P01','Pastor Munemo'),
('R0402P02','Pastor Munemo (L)'),
('R0403P01','Pastor Nzira'),
('R0403P02','Pastor Nzira (L)'),
('R0404P01','Pastor Nyamayaro'),
('R0404P02','Pastor Nyamayaro (L)'),

-- REGION 05
('R0501P01','Pastor Muridzi'),
('R0501P02','Pastor Muridzi (L)'),
('R0502P01','Pastor Mutume'),
('R0502P02','Pastor Mutume (L)'),
('R0503P01','Pastor Mubobo'),
('R0504P01','Pastor Shemiah'),
('R0505P01','Pastor Mbewe'),
('R0505P02','Pastor Mbewe (L)'),

-- REGION 06
('R0601P01','Pastor Shumba G'),
('R0601P02','Pastor Shumba C'),
('R0602P01','Pastor Bright'),
('R0603P01','Pastor Nelson'),
('R0603P02','Pastor Lesley'),
('R0604P01','Pastor Matimbira'),
('R0604P02','Pastor Matimbira (L)'),
('R0605P01','Pastor Kaseke'),
('R0605P02','Pastor Kaseke (L)'),

-- REGION 07
('R0701P01','Pastor Nemangwe'),
('R0701P02','Pastor Nemangwe F'),
('R0702P01','Pastor Bakasa'),
('R0702P02','Pastor Bakasa G'),
('R0703P01','Pastor Mutara'),
('R0703P02','Pastor Mutara T'),
('R0704P01','Pastor Zizhou'),
('R0704P02','Pastor Zizhou (L)'),
('R0705P01','Pastor Kasvosve'),

-- REGION 08
('R0801P01','Pastor Maminimini'),
('R0801P02','Pastor Maminimini M'),
('R0802P01','Pastor Tinarwo'),
('R0802P02','Pastor Tinarwo C'),
('R0803P01','Pastor Mahuno'),
('R0803P02','Pastor Mahuno (L)'),
('R0804P01','Pastor Mlamilo'),
('R0804P02','Pastor Mlamilo (L)'),

-- REGION 09
('R0901P01','Pastor Katso'),
('R0901P02','Pastor Katso (L)'),
('R0902P01','Pastor Chitowo'),
('R0902P02','Pastor Chitowo (L)'),

-- REGION 10
('R1001P01','Pastor Maunganidze'),
('R1001P02','Pastor Maunganidze (L)'),
('R1002P01','Pastor Nemaunga'),
('R1002P02','Pastor Nemaunga (L)'),
('R1003P01','Pastor Oscar'),
('R1004P01','Pastor Mtshalanji'),
('R1004P02','Pastor Mtshalanji (L)'),
('R1005P01','Pastor Molai'),
('R1005P02','Pastor Molai M'),
('R1006P01','Pastor Kavhu'),
('R1006P02','Pastor Kavhu (L)'),

-- REGION 11
('R1101P01','Pastor S Utahwashe'),
('R1102P01','Pastor Mrambiwa'),
('R1102P02','Pastor Murambiwa (L)'),
('R1103P01','Pastor Mashavira'),

-- REGION 12
('R1201P01','Pastor Kuhlengisa'),
('R1201P02','Pastor Kuhlengisa (L)'),
('R1202P01','Pastor Mhangami'),
('R1202P02','Pastor Mhangami (L)'),
('R1203P01','Pastor Chinake'),
('R1203P02','Pastor Chinake (L)'),

-- REGION 13
('R1301P01','Pastor Mhavasha'),
('R1301P02','Pastor Mhavasha (L)'),
('R1302P01','Pastor Mundingi'),
('R1302P02','Pastor Mundingi (L)'),
('R1303P01','Pastor Cledgyman'),

-- REGION 14
('R1401P01','Pastor Kahoba'),
('R1401P02','Pastor Kahoba (L)'),
('R1402P01','Pastor Mtshalanji'),
('R1402P02','Pastor Mtshalanji (L)'),
('R1403P01','Pastor Moyo'),
('R1403P02','Pastor Moyo (L)'),
('R1404P01','Pastor Ndebele'),
('R1405P01','Pastor Mtshalanji'),

-- REGION 15
('R1501P01','Pastor Mudzinge'),
('R1501P02','Pastor Mudzinge (L)'),
('R1502P01','Pastor Tundu'),
('R1502P02','Pastor Tundu S'),

-- REGION 16
('R1601P01','Pastor Matema'),
('R1601P02','Pastor Matema (L)'),
('R1602P01','Pastor Nguruve'),
('R1602P02','Pastor Nguruve (L)'),
('R1603P01','Pastor Dhlamini'),
('R1603P02','Pastor Dhlamini (L)'),

-- REGION 17
('R1701P01','Pastor Tsiko'),
('R1701P02','Pastor Tsiko C'),
('R1702P01','Pastor Gandiwa'),
('R1702P02','Pastor Gandiwa (L)'),
('R1703P01','Pastor Gumbo'),
('R1703P02','Pastor Gumbo (L)'),
('R1704P01','Pastor Gemistone'),
('R1705P01','Pastor Goba'),
('R1705P02','Pastor Goba (L)'),
('R1706P01','Pastor Jimu'),
('R1706P02','Pastor Jimu (L)'),

-- REGION 18
('R1801P01','Pastor Mbofana'),
('R1801P02','Pastor Mbofana (L)'),

-- REGION 19
('R1901P01','Pastor Mutebuka'),
('R1902P01','Pastor Chima'),
('R1902P02','Pastor Chima (L)'),

-- REGION 20
('R2001P01','Pastor Beauty Mutasa'),
('R2001P02','Pastor Mutasa M'),

-- REGION 21
('R2101P01','Pastor Musabayana'),
('R2101P02','Pastor Musabayana (L)'),
('R2102P01','Pastor Muneri'),
('R2103P01','Pastor Kabichi'),
('R2103P02','Pastor Kabichi (L)'),
('R2104P01','Pastor Mabaye'),
('R2104P02','Pastor Mabaye (L)'),
('R2105P01','Pastor Cofe'),
('R2105P02','Pastor Cofe M'),

-- REGION 22
('R2201P01','Pastor Zikhali'),
('R2201P02','Pastor Zikhali P'),
('R2202P01','Pastor Sibanda'),
('R2202P02','Pastor Sibanda (L)'),
('R2203P01','Pastor Ruwende'),
('R2203P02','Pastor Ruwende (L)'),
('R2204P01','Pastor Musevenzo'),
('R2204P02','Pastor Musevenzo (L)')

) AS data(pastor_code, full_name)
JOIN zones z ON z.zone_code = LEFT(data.pastor_code,5)
ON CONFLICT (pastor_code) DO NOTHING;

-- ============================================================================
-- VERIFICATION
-- ============================================================================
SELECT 'Regions' as table_name, COUNT(*) as count FROM regions
UNION ALL
SELECT 'Zones', COUNT(*) FROM zones
UNION ALL
SELECT 'Pastors', COUNT(*) FROM pastors;

-- Verify pastors are linked correctly
SELECT 
    p.pastor_code, 
    p.full_name, 
    z.name as zone_name,
    r.name as region_name
FROM pastors p
JOIN zones z ON z.id = p.zone_id
JOIN regions r ON r.id = z.region_id
ORDER BY p.pastor_code;

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
