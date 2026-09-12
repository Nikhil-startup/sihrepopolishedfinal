export interface StateDistrictMap {
  [state: string]: string[];
}

export const INDIAN_STATES_AND_DISTRICTS: StateDistrictMap = {
  "Andhra Pradesh": [
    "Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna",
    "Kurnool", "Prakasam", "Srikakulam", "Visakhapatnam", "Vizianagaram",
    "West Godavari", "YSR Kadapa", "Nellore"
  ],
  "Assam": [
    "Barpeta", "Cachar", "Darrang", "Dhubri", "Dibrugarh", "Goalpara",
    "Golaghat", "Jorhat", "Kamrup", "Lakhimpur", "Nagaon", "Sonitpur", "Tinsukia"
  ],
  "Bihar": [
    "Araria", "Bhagalpur", "Bhojpur", "Darbhanga", "Gaya", "Katihar",
    "Muzaffarpur", "Nalanda", "Patna", "Purnia", "Rohtas", "Samastipur", "Vaishali"
  ],
  "Chhattisgarh": [
    "Bilaspur", "Dhamtari", "Durg", "Janjgir-Champa", "Korba", "Raigarh",
    "Raipur", "Rajnandgaon", "Surguja"
  ],
  "Gujarat": [
    "Ahmedabad", "Amreli", "Anand", "Banaskantha", "Bharuch", "Bhavnagar",
    "Gandhinagar", "Jamnagar", "Junagadh", "Kheda", "Kutch", "Mehsana",
    "Morbi", "Navsari", "Patan", "Rajkot", "Surat", "Surendranagar", "Vadodara"
  ],
  "Haryana": [
    "Ambala", "Bhiwani", "Faridabad", "Fatehabad", "Gurugram", "Hisar",
    "Jhajjar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Panipat",
    "Rewari", "Rohtak", "Sirsa", "Sonipat", "Yamunanagar"
  ],
  "Himachal Pradesh": [
    "Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Kullu",
    "Mandi", "Shimla", "Sirmaur", "Solan", "Una"
  ],
  "Karnataka": [
    "Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban",
    "Bidar", "Chamarajanagar", "Chikkaballapura", "Chikkamagaluru", "Chitradurga",
    "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri",
    "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur",
    "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", "Vijayapura"
  ],
  "Kerala": [
    "Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam",
    "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta",
    "Thiruvananthapuram", "Thrissur", "Wayanad"
  ],
  "Madhya Pradesh": [
    "Bhopal", "Chhindwara", "Dewas", "Dhar", "Gwalior", "Hoshangabad",
    "Indore", "Jabalpur", "Khandwa", "Khargone", "Mandsaur", "Morena",
    "Neemuch", "Raisen", "Ratlam", "Rewa", "Sagar", "Sehore", "Ujjain", "Vidisha"
  ],
  "Maharashtra": [
    "Ahmednagar", "Akola", "Amravati", "Aurangabad (Chhatrapati Sambhaji Nagar)",
    "Beed", "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli",
    "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City",
    "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad (Dharashiv)",
    "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara",
    "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"
  ],
  "Odisha": [
    "Angul", "Balasore", "Bargarh", "Bhadrak", "Bolangir", "Cuttack",
    "Ganjam", "Jajpur", "Kalahandi", "Khordha", "Koraput", "Mayurbhanj",
    "Puri", "Sambalpur", "Sundargarh"
  ],
  "Punjab": [
    "Amritsar", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Fazilka",
    "Ferozepur", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala",
    "Ludhiana", "Mansa", "Moga", "Muktsar", "Patiala", "Rupnagar",
    "Sangrur", "SAS Nagar (Mohali)", "Tarn Taran"
  ],
  "Rajasthan": [
    "Ajmer", "Alwar", "Barmer", "Bharatpur", "Bhilwara", "Bikaner",
    "Chittorgarh", "Churu", "Dausa", "Ganganagar", "Hanumangarh", "Jaipur",
    "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", "Kota",
    "Nagaur", "Pali", "Sikar", "Tonk", "Udaipur"
  ],
  "Tamil Nadu": [
    "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore",
    "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram",
    "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai",
    "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai",
    "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi",
    "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli",
    "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur",
    "Vellore", "Viluppuram", "Virudhunagar"
  ],
  "Telangana": [
    "Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangaon",
    "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar",
    "Khammam", "Kumuram Bheem Asifabad", "Mahabubabad", "Mahabubnagar",
    "Mancherial", "Medak", "Medchal Malkajgiri", "Mulugu", "Nagarkurnool",
    "Nalgonda", "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli",
    "Rajanna Sircilla", "Rangareddy", "Sangareddy", "Siddipet", "Suryapet",
    "Vikarabad", "Wanaparthy", "Warangal", "Hanamkonda", "Yadadri Bhuvanagiri"
  ],
  "Uttar Pradesh": [
    "Agra", "Aligarh", "Amroha", "Ayodhya", "Azamgarh", "Bareilly",
    "Basti", "Bijnor", "Bulandshahr", "Etawah", "Faizabad", "Farrukhabad",
    "Fatehpur", "Ghaziabad", "Gorakhpur", "Hardoi", "Jaunpur", "Jhansi",
    "Kanpur", "Lakhimpur Kheri", "Lucknow", "Mathura", "Meerut", "Moradabad",
    "Muzaffarnagar", "Prayagraj", "Saharanpur", "Shahjahanpur", "Varanasi"
  ],
  "West Bengal": [
    "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur", "Darjeeling",
    "Hooghly", "Howrah", "Jalpaiguri", "Jhargram", "Kalimpong", "Kolkata",
    "Malda", "Murshidabad", "Nadia", "North 24 Parganas", "Paschim Bardhaman",
    "Paschim Medinipur", "Purba Bardhaman", "Purba Medinipur", "Purulia",
    "South 24 Parganas", "Uttar Dinajpur"
  ]
};

export const INDIAN_STATES = Object.keys(INDIAN_STATES_AND_DISTRICTS).sort();
