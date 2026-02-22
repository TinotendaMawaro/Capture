-- ============================================================================
-- HEARTFELT INTERNATIONAL MINISTRIES
-- Complete Data Migration - Working Version
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
-- PASTORS DATA - Insert one by one to avoid conflicts
-- ============================================================================

-- Region 01 - IOC
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0101P01', 'Pastor Cee', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0101' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0102P01', 'Pastor Mtombeni E', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0102' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0102P02', 'Pastor Mtombeni M', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0102' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0103P01', 'Pastor Chonzi M', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0103' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0103P02', 'Pastor Chonzi (L)', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0103' ON CONFLICT DO NOTHING;

-- Region 02 - Marndra
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0201P01', 'Pastor Chari', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0201' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0201P02', 'Pastor Chari T', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0201' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0202P01', 'Pastor Tonderai', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0202' ON CONFLICT DO NOTHING;

-- Region 03 - Ruwa
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0301P01', 'Pastor Kunaka', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0301' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0301P02', 'Pastor Kunaka P', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0301' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0302P01', 'Pastor Dzikiti', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0302' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0302P02', 'Pastor Dzikiti (L)', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0302' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0303P01', 'Pastor Lorraine', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0303' ON CONFLICT DO NOTHING;

-- Region 04 - Zengeza
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0401P01', 'Pastor Chonzi B', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0401' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0401P02', 'Pastor Chonzi L', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0401' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0402P01', 'Pastor Munemo', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0402' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0402P02', 'Pastor Munemo (L)', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0402' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0403P01', 'Pastor Nzira', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0403' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0403P02', 'Pastor Nzira (L)', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0403' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0404P01', 'Pastor Nyamayaro', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0404' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0404P02', 'Pastor Nyamayaro (L)', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0404' ON CONFLICT DO NOTHING;

-- Region 05 - Epworth
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0501P01', 'Pastor Muridzi', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0501' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0501P02', 'Pastor Muridzi (L)', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0501' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0502P01', 'Pastor Mutume', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0502' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0502P02', 'Pastor Mutume (L)', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0502' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0503P01', 'Pastor Mubobo', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0503' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0504P01', 'Pastor Shemiah', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0504' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0505P01', 'Pastor Mbewe', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0505' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0505P02', 'Pastor Mbewe (L)', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0505' ON CONFLICT DO NOTHING;

-- Region 06 - Mufakose
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0601P01', 'Pastor Shumba G', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0601' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0601P02', 'Pastor Shumba C', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0601' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0602P01', 'Pastor Bright', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0602' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0603P01', 'Pastor Nelson', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0603' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0603P02', 'Pastor Lesley', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0603' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0604P01', 'Pastor Matimbira', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0604' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0604P02', 'Pastor Matimbira (L)', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0604' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0605P01', 'Pastor Kaseke', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0605' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0605P02', 'Pastor Kaseke (L)', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0605' ON CONFLICT DO NOTHING;

-- Region 07 - Southlea Park
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0701P01', 'Pastor Nemangwe', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0701' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0701P02', 'Pastor Nemangwe F', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0701' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0702P01', 'Pastor Bakasa', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0702' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0702P02', 'Pastor Bakasa G', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0702' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0703P01', 'Pastor Mutara', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0703' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0703P02', 'Pastor Mutara T', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0703' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0704P01', 'Pastor Zizhou', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0704' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0704P02', 'Pastor Zizhou (L)', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0704' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0705P01', 'Pastor Kasvosve', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0705' ON CONFLICT DO NOTHING;

-- Region 08 - Glen View
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0801P01', 'Pastor Maminimini', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0801' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0801P02', 'Pastor Maminimini M', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0801' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0802P01', 'Pastor Tinarwo', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0802' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0802P02', 'Pastor Tinarwo C', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0802' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0803P01', 'Pastor Mahuno', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0803' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0803P02', 'Pastor Mahuno (L)', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0803' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0804P01', 'Pastor Mlamilo', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0804' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0804P02', 'Pastor Mlamilo (L)', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0804' ON CONFLICT DO NOTHING;

-- Region 09 - Hatcliff
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0901P01', 'Pastor Katso', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0901' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0901P02', 'Pastor Katso (L)', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0901' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0902P01', 'Pastor Chitowo', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0902' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R0902P02', 'Pastor Chitowo (L)', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R0902' ON CONFLICT DO NOTHING;

-- Region 10 - Waverly
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1001P01', 'Pastor Maunganidze', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1001' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1001P02', 'Pastor Maunganidze (L)', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1001' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1002P01', 'Pastor Nemaunga', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1002' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1002P02', 'Pastor Nemaunga (L)', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1002' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1003P01', 'Pastor Oscar', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1003' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1004P01', 'Pastor Mtshalanji', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1004' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1004P02', 'Pastor Mtshalanji (L)', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1004' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1005P01', 'Pastor Molai', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1005' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1005P02', 'Pastor Molai M', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1005' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1006P01', 'Pastor Kavhu', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1006' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1006P02', 'Pastor Kavhu (L)', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1006' ON CONFLICT DO NOTHING;

-- Region 11 - Kwekwe City
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1101P01', 'Pastor S Utahwashe', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1101' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1102P01', 'Pastor Mrambiwa', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1102' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1102P02', 'Pastor Murambiwa (L)', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1102' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1103P01', 'Pastor Mashavira', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1103' ON CONFLICT DO NOTHING;

-- Region 12 - Chipadze
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1201P01', 'Pastor Kuhlengisa', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1201' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1201P02', 'Pastor Kuhlengisa (L)', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1201' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1202P01', 'Pastor Mhangami', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1202' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1202P02', 'Pastor Mhangami (L)', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1202' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1203P01', 'Pastor Chinake', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1203' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1203P02', 'Pastor Chinake (L)', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1203' ON CONFLICT DO NOTHING;

-- Region 13 - Mutawatawa
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1301P01', 'Pastor Mhavasha', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1301' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1301P02', 'Pastor Mhavasha (L)', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1301' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1302P01', 'Pastor Mundingi', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1302' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1302P02', 'Pastor Mundingi (L)', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1302' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1303P01', 'Pastor Cledgyman', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1303' ON CONFLICT DO NOTHING;

-- Region 14 - St Ives
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1401P01', 'Pastor Kahoba', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1401' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1401P02', 'Pastor Kahoba (L)', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1401' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1402P01', 'Pastor Mtshalanji', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1402' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1402P02', 'Pastor Mtshalanji (L)', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1402' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1403P01', 'Pastor Moyo', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1403' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1403P02', 'Pastor Moyo (L)', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1403' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1404P01', 'Pastor Ndebele', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1404' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1405P01', 'Pastor Mtshalanji', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1405' ON CONFLICT DO NOTHING;

-- Region 15 - International
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1501P01', 'Pastor Mudzinge', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1501' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1501P02', 'Pastor Mudzinge (L)', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1501' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1502P01', 'Pastor Tundu', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1502' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1502P02', 'Pastor Tundu S', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1502' ON CONFLICT DO NOTHING;

-- Region 16 - Zvishavane
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1601P01', 'Pastor Matema', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1601' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1601P02', 'Pastor Matema (L)', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1601' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1602P01', 'Pastor Nguruve', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1602' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1602P02', 'Pastor Nguruve (L)', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1602' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1603P01', 'Pastor Dhlamini', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1603' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1603P02', 'Pastor Dhlamini (L)', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1603' ON CONFLICT DO NOTHING;

-- Region 17 - Kempton Park
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1701P01', 'Pastor Tsiko', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1701' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1701P02', 'Pastor Tsiko C', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1701' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1702P01', 'Pastor Gandiwa', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1702' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1702P02', 'Pastor Gandiwa (L)', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1702' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1703P01', 'Pastor Gumbo', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1703' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1703P02', 'Pastor Gumbo (L)', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1703' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1704P01', 'Pastor Gemistone', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1704' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1705P01', 'Pastor Goba', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1705' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1705P02', 'Pastor Goba (L)', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1705' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1706P01', 'Pastor Jimu', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1706' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1706P02', 'Pastor Jimu (L)', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1706' ON CONFLICT DO NOTHING;

-- Region 18 - Nkulumane
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1801P01', 'Pastor Mbofana', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1801' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1801P02', 'Pastor Mbofana (L)', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1801' ON CONFLICT DO NOTHING;

-- Region 19 - Tete
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1901P01', 'Pastor Mutebuka', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1901' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1902P01', 'Pastor Chima', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1902' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R1902P02', 'Pastor Chima (L)', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R1902' ON CONFLICT DO NOTHING;

-- Region 20 - Gwanda
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R2001P01', 'Pastor Beauty Mutasa', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R2001' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R2001P02', 'Pastor Mutasa M', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R2001' ON CONFLICT DO NOTHING;

-- Region 21 - Mutare
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R2101P01', 'Pastor Musabayana', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R2101' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R2101P02', 'Pastor Musabayana (L)', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R2101' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R2102P01', 'Pastor Muneri', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R2102' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R2103P01', 'Pastor Kabichi', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R2103' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R2103P02', 'Pastor Kabichi (L)', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R2103' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R2104P01', 'Pastor Mabaye', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R2104' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R2104P02', 'Pastor Mabaye (L)', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R2104' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
SELECT 'R2105P01', 'Pastor Cofe', z.id, NOW(), TRUE FROM zones z WHERE z.zone_code = 'R2105' ON CONFLICT DO NOTHING;
INSERT INTO pastors (pastor_code, full_name, zone_id, created_at, is_active) 
