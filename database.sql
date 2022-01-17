-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 15, 2022 at 11:50 AM
-- Server version: 10.4.19-MariaDB
-- PHP Version: 8.0.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `axistones`
--

-- --------------------------------------------------------

--
-- Table structure for table `favourites`
--

CREATE TABLE `favourites` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `favs` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `favourites`
--

INSERT INTO `favourites` (`id`, `user_id`, `favs`) VALUES
(1, 1, '{\"favs\": []}');

-- --------------------------------------------------------

--
-- Table structure for table `investment`
--

CREATE TABLE `investment` (
  `id` int(150) NOT NULL,
  `user_id` varchar(150) NOT NULL,
  `investments` longtext NOT NULL,
  `balance` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `investment_filter`
--

CREATE TABLE `investment_filter` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `plans` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `investment_filter`
--

INSERT INTO `investment_filter` (`id`, `name`, `plans`) VALUES
(1, 'IRR ', '[\"< 12.0%\",\"12.0% - 16.0%\",\"16.0% - 22.0%\",\"> 22.0%\"]'),
(2, 'AVG Cash Yield', '[\"< 5.0%\",\"5.0% - 7.0%\",\"7.0% - 10.0%\",\"> 10.0%\"]'),
(3, 'Preferred Return', '[\"<= 7.0%\",\"7.0% - 8.0%\",\"8.0% - 9.0%\",\"9.0% - 10.0%\",\">= 10.0%\"]'),
(4, 'Equity Multiple', '[\"1.0x - 1.5x\",\"1.5x - 2.0x\",\"2.0x - 3.0x\",\"> 3.0x\"]'),
(5, 'Minimum Investment', '[\"<= $10,000\",\"<= $25,000\",\"<= $50,000\",\"> $50,000\"]'),
(6, 'Minimum Hold Period ', '[\"0 - 2 years\",\"2 - 5 years\",\"5 - 10 years\",\"> 10 years\"]'),
(7, 'Loan-to-Cost', '[\"<= 50.0%\",\"50.0% - 60.0%\",\"60.0% - 70.0%\",\"70.0% - 80.0%\",\">= 80.0%\"]'),
(8, 'Distribution Period', '[\"Monthly\",\"Quarterly\",\"Semi Annually\",\"Annually\"]'),
(9, 'Investment Structure', '[\"Debt\",\"Equity\",\"Mezzanine Debt\",\"Portfolio\",\"Preferred Equity\",\"REIT\"]'),
(10, 'Investment Profile', '[\"Core\",\"Core Plus\",\"Value Add\",\"Opportunistic\",\"Development\"]'),
(11, 'Property Type', '[\"Flex R&D\",\"Hospitality\",\"Industrial\",\"Land\",\"Medical Office\",\"Mixed Use\",\"Multi-Asset\",\"Multifamily\",\"Office\",\"Residential\",\"Retail\",\"Senior Housing\",\"Storage\",\"Student Housing\",\"Manufactured Housing\",\"Built-to-Rent\",\"Flex/Office\",\"Data Center\",\"Parking Garage\",\"Co-Living\",\"Specialty\"]'),
(12, 'Region', '[\"East\",\"West\",\"Midwest\",\"South\",\"Multiple Regions\"]'),
(13, 'Sample', '[\"Sample Product\"]'),
(14, 'Sponsor Experience', '[\"Emerging\",\"Seasoned\",\"Tenured\",\"Enterprise\"]'),
(15, 'Sponsor Co-investment', '[\"<= 5.0%\",\"5.0% - 10.0%\",\"10.0% - 20.0%\",\"20.0% - 30.0%\",\">= 30.0%\"]'),
(16, 'Repeat ', '[\"Only repeat sponsors\"]'),
(17, 'Investor Accreditation', '[\"Accredited Investors Only\",\"Non Accredited Eligible\"]'),
(18, '1031 Exchange', '[\"1031 eligible\"]'),
(19, 'Opportunity Zone', '[\"Opportunity Zone eligible\"]'),
(20, 'SD-IRA Eligible', '[\"SD IRA eligible\"]');

-- --------------------------------------------------------

--
-- Table structure for table `packages`
--

CREATE TABLE `packages` (
  `id` int(11) NOT NULL,
  `plan_id` int(11) NOT NULL,
  `plan` varchar(200) NOT NULL,
  `amount` varchar(150) NOT NULL,
  `percent` varchar(150) NOT NULL,
  `max` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `packages`
--

INSERT INTO `packages` (`id`, `plan_id`, `plan`, `amount`, `percent`, `max`) VALUES
(1, 1, 'Quarterly plan (3 months)', '50,000', '5%', '200,000'),
(2, 1, 'biannual plan (6 months)', '200,000', '4%', '300,000'),
(3, 1, 'yearly plan (1 year)', '300,000', '3%', '500,000'),
(4, 1, '+1year Plan (+1 year)', '500,000', '2%', '1,000,000');

-- --------------------------------------------------------

--
-- Table structure for table `property`
--

CREATE TABLE `property` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `state` varchar(150) NOT NULL,
  `city` varchar(150) NOT NULL,
  `sponsor` varchar(150) NOT NULL,
  `invest_type` varchar(150) NOT NULL,
  `invest_begins` varchar(150) NOT NULL,
  `invest_ends` varchar(150) NOT NULL,
  `is_closed` varchar(100) NOT NULL DEFAULT 'No',
  `irr` varchar(100) NOT NULL,
  `avg_cash_yield` varchar(150) NOT NULL,
  `preferred_return` varchar(150) NOT NULL,
  `equity_multiple` varchar(150) NOT NULL,
  `minimum_investment` varchar(150) NOT NULL,
  `minimum_hold_period` varchar(150) NOT NULL,
  `loan_to_cost` varchar(150) NOT NULL,
  `distribution_period` varchar(150) NOT NULL,
  `investment_structure` varchar(150) NOT NULL,
  `investment_profile` varchar(150) NOT NULL,
  `properties_type` varchar(150) NOT NULL,
  `property_region` varchar(150) NOT NULL,
  `axistone_products` varchar(150) NOT NULL,
  `sponsor_experience` varchar(150) NOT NULL,
  `sponsor_co_investment` varchar(150) NOT NULL,
  `repeat_sponsors` varchar(150) NOT NULL,
  `investor_accreditation` varchar(150) NOT NULL,
  `exchange` varchar(150) NOT NULL,
  `opportunity_zone` varchar(150) NOT NULL,
  `SD_IRA_eligible` varchar(150) NOT NULL,
  `invest_plan` varchar(100) NOT NULL,
  `offering` varchar(150) NOT NULL,
  `description` longtext NOT NULL,
  `unique_id` varchar(150) NOT NULL,
  `rand` varchar(140) NOT NULL,
  `investment_summary` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `property`
--

INSERT INTO `property` (`id`, `name`, `state`, `city`, `sponsor`, `invest_type`, `invest_begins`, `invest_ends`, `is_closed`, `irr`, `avg_cash_yield`, `preferred_return`, `equity_multiple`, `minimum_investment`, `minimum_hold_period`, `loan_to_cost`, `distribution_period`, `investment_structure`, `investment_profile`, `properties_type`, `property_region`, `axistone_products`, `sponsor_experience`, `sponsor_co_investment`, `repeat_sponsors`, `investor_accreditation`, `exchange`, `opportunity_zone`, `SD_IRA_eligible`, `invest_plan`, `offering`, `description`, `unique_id`, `rand`, `investment_summary`) VALUES
(2, 'Savannah Midtown', 'New York', 'Newburgh', 'Axistone', 'Individual Deals', '2021-09-08', '2022-06-17', 'No', '17', '8', '6', '1.9', '50000', '4', '3', 'Monthly', 'Debt', 'Core', 'Flex', 'East', 'Axistone Product', 'Emerging', '5', 'Only repeat sponsors', 'Accredited Investors Only', '1031 eligible', '1031 eligible', 'SD IRA Eligible', 'Bronze', 'funded offering', 'A value-add opportunity on a Midtown Atlanta multifamily complex, surrounded by Billions in investment, walkability, and convenience.\r\n\r\n', 'e688655efe3682', '8b4bed67-f502-4b20-a48f-936e8efcef71', 'The Bernstein Companies (the “Sponsor”) is pleased to offer investors the opportunity to invest up to $13,739,746 in Class A membership interests of OPZ Bernstein Textile, LLC (the “Company” and QOF). The Company intends to use the proceeds of the offering to invest all proceeds into Queen City 205, LLC (the “Property Owner” and QOZB). The Property Owner has been formed for the redevelopment, stabilization, and ultimate sale of the Textile Apartments, a redevelopment of the historic Textile Building into a 282-unit, Class A multifamily property in Cincinnati, Ohio (the “Property”). Bernstein Queen City, LLC, an affiliate of the Sponsor (the “Manager”), will serve as the manager of both the Company and the Property Owner. The Sponsor is contributing $1,526,638 of the total equity investment of $15,266,385.\r\n\r\nThe minimum investment amount is $25,000.'),
(3, '1 Southside Park', 'New York', 'New York City', 'Axistone', 'Individual Deals', '2021-10-07', '2023-11-16', 'No', '16', '9', '7', '2.0', '50000', '5', '2', 'Monthly', 'Debt', 'Core', 'Flex', 'East', 'Axistone Product', 'Emerging', '9', 'Only repeat sponsors', 'Accredited Investors Only', '1031 eligible', '1031 eligible', 'SD IRA Eligible', 'Bronze', 'funded offering', 'An architecturally significant, 64-story mixed-use development, that will bring 1,100+ multifamily units, nearly 200,000 SF of Class A office space, a 189-key Treehouse Hotel, and several high-end amenities in the heart of Miami’s Brickell neighborhood.\r\n\r\n', '3f6625b81dc568', 'a067d965-4375-4b5a-a89a-08fc1c503235', 'With such an amazing deal you are well eligible for good returns.'),
(4, 'Artisan Flats Birmingham', ' AL', 'Birmingham', 'Axistone', 'Individual Deals', '2021-10-28', '2022-06-30', 'No', '13', '9', '8', '2.5', '60000', '5', '5', 'Monthly', 'Debt', 'Core', 'Flex', 'East', 'Axistone Product', 'Emerging', '25', 'Only repeat sponsors', 'Accredited Investors Only', '1031 eligible', '1031 eligible', 'SD IRA Eligible', 'Bronze', 'funded offering', 'A boutique 120-unit multifamily development in the heart of one of Downtown Birmingham’s most vibrant neighborhoods, Lakeview District. The property will offer high-end finishes and amenities at more affordable rates than the competition.\r\n\r\n', '2123233', 'a7b0186a-3617-4915-8dab-976e26bf9fb1', 'Liquid Capital RE LLC (the “Sponsor”) is pleased to offer investors the opportunity to invest up to $10,000,000 in Class A membership interests of LC Savannah Midtown III LLC, a Delaware limited liability company (the “Company”). The Company intends to invest alongside LC Savannah Midtown LLC, LC Savannah Midtown II LLC, LC Savannah Midtown IV LLC (all Delaware limited liability companies), and LC Savannah Midtown V LP, a Delaware limited partnership, to acquire, as tenants in common, a 100% ownership interest in 215 North Avenue NE Atlanta GA 308 (The “Property Owner”). The Property Owner has been formed for the acquisition, renovation, stabilization, and ultimate sale of Savannah Midtown, an existing 322-unit Class A multifamily apartment development in Savannah, Georgia (the “Property”). LC Savannah Midtown Manager LLC, a Delaware limited liability company, and affiliate of the Sponsor (the “Manager”), will serve as the manager of both the Company and the Property Owner. The Sponsor is contributing $2,496,256 of the total equity investment of $24,962,564. The minimum investment amount is $25,000'),
(5, '10 Federal Self Storage 3', ' AL', 'Birmingham', 'Axistone', 'Individual Deals', '2021-10-25', '2021-11-30', 'Yes', '17', '8', '7', '1.5', '40000', '3', '3', 'Monthly', 'Debt', 'Core', 'Flex', 'East', 'Axistone Product', 'Emerging', '19', 'Only repeat sponsors', 'Accredited Investors Only', '1031 eligible', '1031 eligible', 'SD IRA Eligible', 'Bronze', 'funded offering', 'An experienced, value-add self-storage investment company replicating a proven business plan by acquiring and converting facilities to automated operations using proprietary technologies.\r\n\r\n', '12162171', '2f837895-a17b-48d4-911a-2eb8d93228d3', 'With such an amazing deal you are well eligible for good returns.'),
(6, 'Staybridge Suites OZ', 'Detriot', 'Wilmington', 'Driftwood', 'Individual Deals', '2021-10-27', '2022-11-12', 'No', '14.3', '9.5', '10', '2.0', '50000', '3', '5', 'Monthly', 'Debt', 'Core', 'Flex', 'East', 'Axistone Product', 'Emerging', '6', 'Only repeat sponsors', 'Accredited Investors Only', '1031 eligible', '1031 eligible', 'SD IRA Eligible', 'Bronze', 'funded offering', 'The redevelopment of a 98,970 SF office building to a 134-key, extended-stay, urban Staybridge Suites hotel by IHG located in the heart of Downtown Wilmington, recognized as an opportunity zone and part of the Wilmington Redevelopment District.\r\n\r\n', '19e2c29bb3a057', 'ccedcbca-0641-4f38-9351-dc2d8641a114', 'Driftwood Capital (the “Sponsor”) is pleased to offer investors the opportunity to invest up to $3,000,000 in membership interests of DDP Wilmington Qualified Opportunity Fund Investors, LLC, a Delaware limited liability company (the “Company”). The Company intends to use the proceeds of the offering to acquire a 94% ownership interest in DAD Wilmington QOZB, LP (the “Property Owner”). The Property Owner has been formed for acquisition, conversion, stabilization, and ultimate sale of a class A ofﬁce building, centrally located in downtown Wilmington, DE, that will be converted to a 134-room Urban Staybridge Suites hotel by IHG (the “Property”). Driftwood QOF GP II, LLC, a Delaware limited liability company and affiliate of the Sponsor (the “Manager”), will serve as the manager of the Company and DAD QOF Wilmington GP, LLC, will serve as general partner of the Property Owner. The Sponsor is contributing $599,280 of the total equity investment of $10,120,291.\r\n\r\nThe minimum investment amount is $50,000.'),
(7, 'Sunbelt Multifamily GP Fund', 'California', 'San diego', 'Frankforter Group', 'Individual Deals', '2021-10-29', '2022-08-27', 'No', '16', '9.5', '10', '2.5', '50000', '4', '5', 'Monthly', 'Debt', 'Core', 'Flex', 'East', 'Axistone Product', 'Emerging', '23', 'Only repeat sponsors', 'Accredited Investors Only', '1031 eligible', '1031 eligible', 'SD IRA Eligible', 'Bronze', 'funded offering', 'Potential for outsized returns over traditional limited partner position through general partner investment position 30% promote participation. Fund will target core-plus and value-add multifamily acquisitions across the U.S. Sunbelt region.\r\n\r\n', 'b90962ed98c016', '5c367b97-0e11-4722-adde-47c6e3ca7405', 'Frankforter Group (\"Frankforter\", or the \"Sponsor\") is pleased to offer investors the opportunity to invest in the Frankforter Group CS GP Fund, LP (the \"Fund\"). The Fund will invest as the general partner alongside in value-add multifamily acquisitions throughout the Sunbelt region in the United States. The Sponsor will be the General Partner of the Fund and will retain all major decision-making rights of the Fund. In addition to a return of capital and pari passu profits, investors will receive 30% of the promote earned from JV Partners enhancing returns to limited partners. The Sponsor and affiliates intend to contribute approximately 10.0% of total capital commitments to the Partnership.\r\n\r\nThe minimum investment amount for Qualified Purchasers is $50,000.'),
(8, 'S Baxter Ct', 'Idaho', 'Boise', 'Axistone ', 'Individual Deals', '2021-10-26', '2023-11-16', 'No', '5', '10.5', '9', '2.5', '80000', '5', '4', 'Monthly', 'Debt', 'Core', 'Flex', 'East', 'Axistone Product', 'Emerging', '4', 'Only repeat sponsors', 'Accredited Investors Only', '1031 eligible', '1031 eligible', 'SD IRA Eligible', 'Bronze', 'funded offering', 'An A class residential house.', 'c4179e49173bba', '4978962d-31a6-4a54-81ab-36b546dcdf5f', 'Tracy Capital (the “Sponsor”) is pleased to offer investors the opportunity to invest up to $3,000,000 in membership interests of DDP Wilmington Qualified Opportunity Fund Investors, LLC, a Delaware limited liability company (the “Company”). The Company intends to use the proceeds of the offering to acquire a 94% ownership interest in DAD Wilmington QOZB, LP (the “Property Owner”). The Property Owner has been formed for acquisition, conversion, stabilization, and ultimate sale of a class A ofﬁce building, centrally located in downtown Wilmington, DE, that will be converted to a 134-room Urban Staybridge Suites hotel by IHG (the “Property”). Driftwood QOF GP II, LLC, a Delaware limited liability company and affiliate of the Sponsor (the “Manager”), will serve as the manager of the Company and DAD QOF Wilmington GP, LLC, will serve as general partner of the Property Owner. The Sponsor is contributing $599,280 of the total equity investment of $10,120,291.\r\n\r\nThe minimum investment amount is $50,000'),
(9, 'Bergin work spaces ', 'Pennsylvania ', 'Pittsburgh ', 'Bergin Groups', 'Individual Deals', '2021-10-25', '2022-02-24', 'No', '14', '10', '7.6', '2.0', '40000', '3', '3', 'Monthly', 'REIT', 'Core', 'Flex/Office', 'Multiple Regions', 'Axistone Product', 'Emerging', '', 'Only repeat sponsors', 'Non Accredited Eligible', '1031 eligible', '1031 eligible', 'SD IRA Eligible', 'Bronze', 'funded offering', 'Our work spaces and offices are designed and built by the best of engineers and architects. With keen attention giving to details that facilitate a good working space. Such as ventilation, heating and cooling systems, lighting, color, accessibility, large working area and also good communication area for future tenants. Our offices are placed in metropolitan locations with access to other business and proper exposure ', 'fcc390b0dfdc3e', '40aa4f51-6027-4ea5-8b3d-b0b93769e856', 'Investors stand to gain from Bergin work spaces as we are constantly in business, leasing,renting and also expanding. Chime in now and be part of the winning team'),
(10, 'Keliab complex', 'Arkansas ', 'Hot spring', 'Axistone ', 'Individual Deals', '2021-11-02', '2022-04-30', 'No', '11', '9', '9.5', '2.5', '60000', '3', '5', 'Monthly', 'Debt', 'Core', 'Flex', 'East', 'Axistone Product', 'Emerging', '', 'Only repeat sponsors', 'Accredited Investors Only', '1031 eligible', '1031 eligible', 'SD IRA Eligible', 'Bronze', 'funded offering', 'High profile Modern and Premier Industrial Development.\r\n\r\nBoutique 9 Unit Development - Architecturally Designed with Units ranging from 151 m2 to 237 m2. \r\n\r\nCP Metro will offer the following qualities:\r\n\r\n- Showroom / Retail entries in a High Profile Location\r\n- Concrete Tilt Panel Construction and High Finishes\r\n- 7m Internal Height Plus High Electric Roller Door Access\r\n- Modern fascia and Garden Aesthetics\r\n- Easy Vehicle and Truck access\r\n- 2 Street access\r\n- Ample On-Site Car spaces for Customers and Tenants', '891553d6972429', 'e4f0161f-6912-42aa-8bae-6e0726c3a30d', '.'),
(11, 'Holmes property ', 'Washington, DC', 'Wahsington DC', 'Meridian & co groups ', 'Individual Deals', '2021-10-29', '2022-06-30', 'No', '8', '12', '10.5', '3.0', '100000', '5', '', 'Monthly', 'Debt', 'Core', 'Flex', 'East', 'Axistone Product', 'Emerging', '', 'Only repeat sponsors', 'Accredited Investors Only', '1031 eligible', '1031 eligible', 'SD IRA Eligible', 'Bronze', 'funded offering', '2201 L St NW has tremendous location and is within walking distance to Foggy Bottom Metro, GW University and Hospital, Ritz Carlton Hotel, and Equinox\r\nThe condo is perfect for an owner/user occupation or a motivated investor to rent to one or more tenants.\r\nThe medical condo has ample lighting throughout and has direct street access and L Street frontage.\r\nMedical and dental occupants have immediate exposure to potential clients that live within the 2201 L St NW residential condos.\r\nGreat open space with a drop-ceiling, lighting, HVAC, and electrical in place with multiple spaces throughout.\r\n', '8de72e3616d92d', 'a0a4a346-23a6-41e0-9653-abe4d28cb8cf', 'Avison Young, in partnership with Ten-X, is pleased to offer the sale of a medical condo within 2201 L St NW.\r\n\r\nThe medial condo within 2201 L St NW is a unique purchase opportunity for a user or investor in the heart of the West End of Washington, DC. This unique property can be purchased and occupied for over 25% less than comparable lease options. This property also offers the purchaser an opportunity to demise the space to create an income-generating property that will further offset the expenses of the purchaser’s ownership in the asset. Furthermore, this asset can be ready for occupancy in 90 days with cosmetic improvements.\r\n\r\n2201 L Street NW is located directly across the street from the Ritz Carlton on the Northwest corner of L street. The property is also within walking distance to Foggy Bottom Metro Station, George Washington University and Hospital, and Equinox. The property is a commuter\'s dream due to its immediate access to Hwy 29 and multiple public bus line and transit options. Occupants who live outside of Washington, DC can be in Downtown Arlington in under 15 minutes, Old Town Alexandria in under 25 minutes, and Bethesda, MD in under 30 minutes. Opportunities with this type of premier location are rare. The potential uses for this condo are nearly endless; the ideal occupant could specialize in medical services, dental, childcare and more.'),
(12, 'Guardian ', 'Massachusetts', 'Boston', 'Cushman & Wakefield investments ', 'Individual Deals', '2021-07-07', '2022-11-25', 'No', '8', '14', '12', '3.5', '450000', '5', '', 'Monthly', 'Debt', 'Core', 'Flex', 'East', 'Axistone Product', 'Emerging', '15', 'Only repeat sponsors', 'Accredited Investors Only', '1031 eligible', '1031 eligible', 'SD IRA Eligible', 'Gold', 'funded offering', '- Brand new 15 year net lease to 2036 + options to 2056\r\n- Guardian Childcare & Education - Blue chip national operator with 120+ centres, backed by $160 Billion global investment powerhouse Partners Group\r\n- Highly connected & convenient position only 50m to Parramatta Road (58,955+ vehicles daily)\r\n- Newly reopened, fully refurbished childcare centre featuring well-appointed finishes, expansive 523 sqm roof-top playscape & providing strong depreciation benefits\r\n- Expertly configured three storey 1,731 sqm childcare facility licensed for 110 LDC places\r\n- Near major employment nodes of Alfred Hospital & Boston University \r\n- Strategic childcare location amongst a high density catchment, 207,526 residents & 61 schools within 3 km\r\n- Camperdown - Sought after suburb only 3 km to CBD \r\n- Landlord favourable lease including termination clause after 10 years - Allowing for genuine development upside & alternate uses\r\n- Secure net lease - Tenant pays all usual outgoings\r\n- Land Tax free commercial investment\r\n- Minimum 3% annual rent increases\r\n- Net Income $410,000 pa + GST', 'fa4cd895b8dfaf', '3938bad6-879f-42a1-82d3-4749118f881f', '.'),
(13, 'JML Storage ', 'Massachusetts ', 'Charleston', 'JML Corp ', 'Individual Deals', '2021-09-01', '2022-11-01', 'No', '9', '10', '9', '2.5', '200000', '4', '', 'Monthly', 'Debt', 'Core', 'Flex', 'East', 'Axistone Product', 'Emerging', '', 'Only repeat sponsors', 'Accredited Investors Only', '1031 eligible', '1031 eligible', 'SD IRA Eligible', 'Bronze', 'funded offering', 'Expansive waterfront facility just outside downtown Boston offering creative office, industrial, and flex space perfect for a wide range of users.\r\nEnjoy an on-site café and short walk to Charlestown\'s best shopping, dining, and entertainment along Bunker Hill Street and Main Street.\r\nFeaturing reinforced concrete floors, 10\' ceilings, passenger and freight elevators, easy access to loading docks, and secure on-site storage.\r\nPerfectly positioned five minutes from downtown Boston with easy access to all of New England, less than a mile to Route 1 and three miles to I-93.', 'c768d05a81df63', '9ec275dc-6740-480c-96a6-e89324a88e53', '.'),
(14, 'Lewis Homes ', 'Illinois ', 'Chicago ', 'Axistone ', 'Individual Deals', '2021-09-02', '2022-07-28', 'No', '10', '10', '9', '2.5', '100000', '4', '', 'Monthly', 'Debt', 'Core', 'Flex', 'East', 'Axistone Product', 'Emerging', '', 'Only repeat sponsors', 'Accredited Investors Only', '1031 eligible', '1031 eligible', 'SD IRA Eligible', 'Bronze', 'funded offering', 'Taking centre stage,  It represents the perfect opportunity to secure this unique property only 300 metres from Humboldt Park Beach\r\n\r\nWith a substantial site area of over 518 m²* and encompassing 2 licenced restaurants, and 3 residential apartments, the building presents a diverse mix of tenancies whilst at the same time presenting flexibility for future development opportunities^.\r\n\r\n141-143 Curlewis Street attributes include:\r\n- Moments to the golden sands of Humboldt Park Beach\r\n- Exceptional investment or development opportunity^\r\n- Diverse Income streams in tightly held and highly sought-after retail strip\r\n- 3 first floor residential apartments\r\n- 2 huge retail tenancies with valuable approval as licenced restaurants, home to Neighbourhood and formerly Milky Lane\r\n- Featuring rare Alfresco dining areas\r\n- Substantial site area of 518.5 m²*\r\n- Flexible B4 mixed use zoning\r\n- Net income fully leased basis of $417,443 per annum*\r\n- Unmissable opportunity to secure your piece of the world\'s most famous beachside locale.', 'ea4c760afcceb6', '2e3ae9dd-a1f0-46d7-95ab-42be4c3a83ba', '.'),
(15, 'Bradonly', 'Connecticut ', 'Hartford ', 'Axistone ', 'Individual Deals', '2021-10-12', '2022-05-27', 'No', '11', '10.5', '9.5', '2.0', '120000', '3', '', 'Monthly', 'Debt', 'Core', 'Flex', 'East', 'Axistone Product', 'Emerging', '', 'Only repeat sponsors', 'Accredited Investors Only', '1031 eligible', '1031 eligible', 'SD IRA Eligible', 'Silver', 'funded offering', 'An exciting retail offering to the marketplace located in the brand new \"Grand Development\" which has been recently completed.\r\n\r\nBradonly  is a rare opportunity to be a part of the very best that Harford has to offer. Located in the heart of the Junction, Grand offers easy access to everything that makes this area a global destination.\r\n\r\nThis ground level strata shop front comprises of approx. 50sqm plus 1 x car space on tittle suitable for various uses including Retail, Medical, Professional, Service, Beauty, Hair Salon and more (STCA).\r\n\r\nIdeally located across from Eastgate Shopping with a short walk to Interchange, a great opportunity for any investor or owner occupier looking to secure a great location in the heart of Eastern Suburbs busiest area.', '594fba5b2d1694', '23287ce2-fcb4-413a-8c38-e46e0fcb4e01', '.'),
(16, 'Quest Palmerston', 'Michigan ', 'Detroit ', 'Palmerston ', 'Individual Deals', '2021-11-01', '2022-09-28', 'No', '12', '9.5', '8.5', '2.5', '40000', '5', '', 'Monthly', 'Debt', 'Core', 'Flex', 'East', 'Axistone Product', 'Emerging', '', 'Only repeat sponsors', 'Accredited Investors Only', '1031 eligible', '1031 eligible', 'SD IRA Eligible', 'Bronze', 'funded offering', 'Fully Leased Investment\r\nSuperior Product in Palmerston\r\nLimited Competition\r\nFully Leased Investment\r\n\r\n-A rare fully leased 4.0 star hotel offering, with options extending to 2044.\r\n-Passing Base Rent as of September 2021, is $1,467,270 per annum with 2.75% annual reviews.\r\n-Passing Net Income (exc. Turnover rent) of $1,404,593 per annum.\r\n\r\nSuperior Product in Palmerston\r\n\r\n-Freehold interest comprising 9-level, 84 key serviced apartment hotel with associated facilities.\r\n-Quest Palmerston is highly regarded as one of the premier accommodation offerings in the city.', 'a4259c84e0485f', 'dd9b4841-6c47-4503-9f3d-175fd535d86e', ' . '),
(17, 'Waterland Golf Course ', 'New York', 'New york', 'Axistone ', 'Individual Deals', '2021-09-01', '2022-08-31', 'No', '7', '14', '12', '3.5', '450000', '6', '', 'Monthly', 'Debt', 'Core', 'Flex', 'East', 'Axistone Product', 'Emerging', '', 'Only repeat sponsors', 'Accredited Investors Only', '1031 eligible', '1031 eligible', 'SD IRA Eligible', 'Gold', 'funded offering', 'Impressive Par 72 Golf Course\r\n12 Breathtaking accommodation suites\r\nBusiness and freehold offered\r\nThe CBRE Metropolitan Investment and Hotels team are proud to present for sale the business and freehold of the Waikerie Golf and Country Club. The golf course is one of the leading South Australian Riverland courses, boasting a full 18-hole par 72 golf course which is exceptionally curated and offers enjoyment and challenge to both an amateur and experienced golfer.\r\n\r\nThe key feature of the property however is the 12-room luxury accommodation that has recently been constructed. This is one of the key differences to other regional courses and is proving highly effective for the club and business and attendance which is demonstrated by the pre-booking all the way through to November (with more bookings taken weekly!).\r\n\r\nThe course is surrounded by a range of additional vacant sites which the vendor will consider in the divestment which will give the incoming purchaser the opportunity to further expand their operation in time to come.\r\n\r\nThe key sales highlights include:\r\n- Full par 72 golf course\r\n- 12 suite luxury accommodation\r\n- Range of additional land options available\r\n- Business and freehold being sold\r\n- Impressive net profit through COVID in FY20/21\r\n- 90 Megalitres of recycled water', 'f3f05aff1131f5', 'cd710db5-ff11-422e-829d-9ab1642fabd7', '.'),
(18, 'Balmoral Hotels', 'California ', 'Los Angeles', 'Simmons group', 'Individual Deals', '2021-10-04', '2022-09-29', 'No', '8', '11', '10.5', '3.0', '200000', '4', '', 'Monthly', 'Debt', 'Core', 'Flex', 'East', 'Axistone Product', 'Emerging', '', 'Only repeat sponsors', 'Accredited Investors Only', '1031 eligible', '1031 eligible', 'SD IRA Eligible', 'Silver', 'funded offering', '6 x 2 and 6 x 1 bedroom units.\r\nUnits recently been recently upgraded.\r\nNorth facing, good natural light & views\r\nRare opportunity to purchase a block of strata units,with expansive water views to the Heads, which cannot be built out.\r\nFirst time offered for sale since completion in early 1960\'s.\r\nCurrently operating as short & long term stays, which offer buyers various options including continuing the existing business, long term residential leasing or possible redevelopment, subject to Council approval.\r\n\r\n- Comprises of 6 x 2 bedroom and 6 x 1 bedroom units.\r\n- All units have recently been recently upgraded.\r\n- Seven are fully furnished & equipped.\r\n- On site parking for 8 vehicles.\r\n- North facing with great natural light & views.\r\n- Short walk to Mosman Village, Spit Jungle \r\n- Ample nus services with interchange at top of Clifford Street.', '5a0b302ed3a4b9', 'a82f1efa-1544-46a6-bb33-92e92d5fdc30', '.'),
(19, 'Norfolk Island', 'Florida', 'Tampa', 'Axistone', 'Individual Deals', '2021-08-04', '2022-10-31', 'No', '7', '14', '11.5', '3.5', '500000', '7', '', 'Monthly', 'Debt', 'Core', 'Flex', 'East', 'Axistone Product', 'Emerging', '', 'Only repeat sponsors', 'Accredited Investors Only', '1031 eligible', '1031 eligible', 'SD IRA Eligible', 'Gold', 'funded offering', 'This premier Norfolk Island Hotel/Motel business includes Accommodation and Dining as well as its very own Brewery.\r\n\r\nThe modern accommodation features spacious motel-style rooms as well as apartments. The beautiful restaurant can seat over 100 patrons both inside and outside on the alfresco deck and overlooks the island\'s natural landscape.\r\n\r\nThe on-site Brewery is great for holiday makers and the local people as it keeps up supply all year round.\r\n\r\nThere is an Owner/Managers residence with plenty of parking and sheds for equipment and storage. There is also a separate house for staff or potential rent opportunity.', 'ba869084aa98a3', '66ea4947-f68c-412d-9ef3-b25480a28a7d', '.'),
(20, 'Rydges Harbor', 'Sydney', 'Sydney Harbor ', 'Axistone', 'Individual Deals', '2021-09-01', '2022-06-29', 'No', '10', '10', '8.5', '2.5', '250000', '5', '', 'Monthly', 'Debt', 'Core', 'Flex', 'East', 'Axistone Product', 'Emerging', '', 'Only repeat sponsors', 'Accredited Investors Only', '1031 eligible', '1031 eligible', 'SD IRA Eligible', 'Silver', 'funded offering', '176 well-appointed rooms and suites\r\nRooftop swimming pool and event space\r\nPrized \"dress circle\" Sydney location\r\nColliers have been exclusively retained to offer for sale Rydges Sydney Harbour, located at 55 George Street in The Rocks, Sydney.\r\n\r\nRydges Sydney Harbour is an exceptionally located hotel in Sydney Harbour\'s prized \"dress circle\" and one of only five hotels in the historic Rocks precinct, the oldest part of Sydney. The Hotel\'s unique position ensures that it captures a broad variety of demand through its proximity to Sydney Harbour, Circular Quay, the Opera House and the major commercial towers in the city core, as well as the Walsh Bay Arts Precinct.\r\n\r\nThe Hotel features 176 well-appointed rooms and suites, with views overlooking Sydney Harbour, the Rocks or Sydney\'s skyline. The rooftop swimming pool and event space is a key selling feature of the Hotel, given its panoramic views of Sydney Harbour. This rooftop \"hero shot\" captures global interest in the Property, cementing its enviable status in the Sydney hotel market.\r\n\r\nThe Hotel occupies two buildings over six and eight floors within a heritage facade, resplendent of the historic location. There is an immediate sense of arrival upon entering the Hotel, with its imposing atrium lobby flooded with natural light from the glass skylight roof. A spiral staircase leads guests to the Level 1 restaurant, which then spills onto Playfair Street at the rear of the Hotel. Two ground floor, George Street facing tenancies straddle the entrance and provide future re-positioning options to further activate the food and beverage offering at the Hotel.\r\n', '7a5ba48eda02a2', '1bf63a7f-6b9e-494d-8cf0-39bbe64e295e', '.'),
(21, 'Mona farms ', 'Sydney ', 'Sydney', 'Cushman ', 'Individual Deals', '2021-07-07', '2022-07-28', 'No', '9', '12', '9.5', '3.0', '350000', '5', '', 'Monthly', 'Debt', 'Core', 'Flex', 'East', 'Axistone Product', 'Emerging', '', 'Only repeat sponsors', 'Accredited Investors Only', '1031 eligible', '1031 eligible', 'SD IRA Eligible', 'Gold', 'funded offering', 'Blue Ribbon North Shore Location\r\nFixed 3.5% Annual Rent Increases\r\nNet Income $636,307 pa + GST\r\nCushman & Wakefield is pleased to present to the market 316 Mona Vale Road, St Ives for Sale via Auction.\r\n\r\nThe property has the following key characteristics:\r\n\r\n- New 15 year triple net lease to 2035 + options to 2055\r\n- Orchard Early Learning Centre - Premium, multi-centre operator led by an expert team with 20+ years\' experience & high occupancy across all facilities\r\n- Stunning, architecturally designed 98 place childcare centre & Sydney\'s first carbon-neutral facility\r\n- Recently completed construction in 2020, providing optimal depreciation benefits\r\n- Irreplaceable 2,017 sqm corner site boasting 40m frontage to Mona Vale Road (44,000+ vehicles daily) \r\n- Prime position in close proximity to Woolworths, Coles & Harris Farm Markets anchored St Ives Shopping Village (100+ additional retailers)\r\n- Ideal childcare location - 20 school within 3 km or 5 minutes drive \r\n- St Ives - Premier North Shore suburb only 15 km.\r\n- Genuine triple net lease - Tenant pays all outgoings including Structural Repairs & Maintenance - Set & forget income \r\n- Fixed 3.5% annual rent increases\r\n- Net Income $636,307 pa + GST', '7f662c95cfedbc', '81fa073a-6839-40bf-93cd-ff22e8c6d3b7', '.');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(250) NOT NULL,
  `fname` varchar(150) NOT NULL,
  `lname` varchar(150) NOT NULL,
  `ssn` varchar(100) NOT NULL,
  `Phone` varchar(150) NOT NULL,
  `country` varchar(150) NOT NULL,
  `dob` varchar(150) NOT NULL,
  `gender` varchar(100) NOT NULL,
  `contact_address` varchar(150) NOT NULL,
  `password` varchar(300) NOT NULL,
  `is_investor` varchar(100) NOT NULL,
  `disabled` varchar(150) NOT NULL DEFAULT 'No',
  `isAdmin` varchar(150) NOT NULL DEFAULT 'No',
  `login_hash` varchar(100) NOT NULL,
  `rand` varchar(100) NOT NULL,
  `verification` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `favourites`
--
ALTER TABLE `favourites`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `investment`
--
ALTER TABLE `investment`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `investment_filter`
--
ALTER TABLE `investment_filter`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `packages`
--
ALTER TABLE `packages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `property`
--
ALTER TABLE `property`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `favourites`
--
ALTER TABLE `favourites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `investment`
--
ALTER TABLE `investment`
  MODIFY `id` int(150) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `investment_filter`
--
ALTER TABLE `investment_filter`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `packages`
--
ALTER TABLE `packages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `property`
--
ALTER TABLE `property`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
