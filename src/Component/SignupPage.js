import React, { useEffect, useRef, useState } from "react";
import "./SignupPage.css"; // Import your CSS file for styling
import { useNavigate } from "react-router-dom";
import { createRenderer } from "react-dom/test-utils";
import OtpVerify from "./OtpVerify";

function SignupPage() {
  let url = "https://admin.taxiscout24.com/";
  const [userType, setUserType] = useState("user"); // Default userType is user
  const [STATE, setSTATE] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [dialCode, setDialCode] = useState("");
  const navigate = useNavigate();
  const [otp_visible, setOtp_visible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result); // Set the image as a base64 string
      };
      reader.readAsDataURL(file); // Read file as a data URL (base64)
    }
  };

  const handleClick = () => {
    document.getElementById("fileInput").click();
  };

  //   sign up api

  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Selected file:", file);
      // Handle the file upload here
    }
  };

  const [credentials, setCredentials] = useState({
    name: "",
    mobile: "",
    email: "",
    country: "",
    password: "",
    cpassword: "",
    profile: null,
    city: "",
    state: "",
    postal_code: "",
    address: "",
    area: { STATE },

    cname: "",
    contact_name: "",
  });

  let history = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`${url}api/v1/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: credentials.name,
        mobile: credentials.mobile,
        email: credentials.email,
        password: credentials.password,
        password_confirmation: credentials.cpassword,
        profile_picture: selectedImage,
        country: selectedCountry,

        //  password: credentials.password , cpassword : credentials.cpassword
      }),
    });

    const json = await response.json();
    // console.log(json);

    if (response.ok) {
      // alert("Check Your Email");
      localStorage.setItem(`email`, `${credentials.email}`);
      setOtp_visible(true);
    } else {
      alert(json.message);
      console.log(json.message);
    }
  };

  const handleSubmitCompany = async (e) => {
    e.preventDefault();

    const response = await fetch(`${url}api/v1/compnayregister`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role: " admin",
        service_location_id: selectedState,
        company_name: credentials.cname,
        mobile: credentials.mobile,
        email: credentials.email,
        country: selectedCountry,
        // state: credentials.state,
        city: credentials.city,
        password: credentials.password,
        password_confirmation: credentials.cpassword,
        address: credentials.address,
        postal_code: credentials.postal,
        profile_picture: selectedImage,
        package_id: 1,
        name: credentials.contact_name,

        //  password: credentials.password , cpassword : credentials.cpassword
      }),
    });

    const json = await response.json();
    localStorage.setItem("email", credentials.email)
    // console.log(json);

    if (response.ok) {
      alert("You are Registered successfully");
      setOtp_visible(true);

    } else {
      let alertMessage = '';
      let errorMessages =json.errors

      Object.keys(errorMessages).forEach((key) => {
        const messages = errorMessages[key]; // Get error messages array for this key
        alertMessage += messages.join(' ') + '\n'; // Concatenate each message
      });

      // Displaying error messages in an alert
      alert(alertMessage);
      console.log(json.message);
    }

    //   localStorage.setItem('token', json.authtoken);
    //   history("/home");
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });

    // setSelectedCountry(e.target.value);
  };

  // country method

  useEffect(() => {
    const countryMethod = async () => {
      try {
        let response = await fetch(`${url}api/v1/countries`, {
          method: "GET",

          headers: {
            "Content-Type": "application/json",
          },
        });
        let data = await response.json();
        // const countriesData = data.map(({ name }) => ({
        //   name
        // }));
        setCountries(data.data);
      } catch (err) {}
    };
    countryMethod();
  }, []);
  // console.log("country code " ,countries[0].dial_code)
  // console.log("outer country " , countries)
  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);

    console.log("is it working", e.target.value);
  };
  // states and citiies
  // country method

  useEffect(() => {
    const stateMethod = async () => {
      try {
        let response = await fetch(`${url}api/v1/servicelocation`, {
          method: "GET",

          headers: {
            "Content-Type": "application/json",
          },
        });
        let data = await response.json();
        // const countriesData = data.map(({ name }) => ({
        //   name
        // }));
        // console.log(data)
        setSTATE(data.data);
      } catch (err) {}
    };
    stateMethod();
  }, []);

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
  };

  return (
    <>
      <div id="banner_img_home"  >
        {otp_visible == true ? (
          <div id="otp_verify">
            <OtpVerify />
          </div>
        ) : (
          <div>
            {userType === "user" ? (
              <div className="container flex justify-end items-center ">
                <div className="signup-container">
                  <h1 className="text-white">Sign Up</h1>
                  <div className="signup-options flex-row gap-3">
                    <div
                      className={`option ${
                        userType === "user" ? "active" : ""
                      }`}
                      onClick={() => setUserType("user")}
                    >
                      User
                    </div>
                    <div
                      className={`option ${
                        userType === "company" ? "active" : ""
                      }`}
                      onClick={() => setUserType("company")}
                    >
                      Company
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    {selectedImage ? (
                      <img
                        src={selectedImage}
                        alt="Profile"
                        className="w-20 h-20 rounded-full object-cover mb-4"
                      />
                    ) : null}

                    <input
                      id="fileInput"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />

                    <button
                      onClick={handleClick}
                      className="px-4 py-2 bg-blue-500 text-black rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                      Upload Logo/Profile
                    </button>
                  </div>
                  <form
                    className=" w-fit  grid gird-cols-1 md:grid-cols-2 gap-x-2 "
                    onSubmit={handleSubmit}
                  >
                    <div className="form-group">
                      <input
                        type="text"
                        name="name"
                        placeholder="name"
                        value={credentials.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={credentials.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <input
                        type="number"
                        name="mobile"
                        placeholder="Mobile Number"
                        value={credentials.mobile}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="password"
                        name="password"
                        placeholder="password"
                        value={credentials.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="password"
                        name="cpassword"
                        placeholder="Confirm Password"
                        value={credentials.cpassword}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <select
                        id="countrySelect"
                        value={selectedCountry}
                        onChange={handleCountryChange}
                      >
                        <option value="">Select a country:</option>
                        {countries.map((country, index) => (
                          <option
                            key={index}
                            name="country"
                            value={country.dial_code}
                          >
                            {country.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* <div className="flex gap-2 relative my-1 ">
                      <div className="form-group cc001 absolute">
                        <input
                          type="file"
                          name="profile"
                          placeholder="select"
                          value={credentials.profile}
                          ref={fileInputRef}
                          style={{ display: "none" }}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <button
                        id="upload_profile"
                        // className="mb-3"
                        onClick={handleButtonClick}
                      >
                        Upload profile pic
                      </button>
                    </div> */}
                    <button
                      id="signup_btn"
                      className=" md:translate-x-[50%]"
                      type="submit"
                      onClick={handleSubmit}
                    >
                      Sign Up as {userType}
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="container flex justify-end items-center">
                <div className="signup-container">
                  <h1 className="text-white">Sign Up</h1>
                  <div className="signup-options flex gap-3">
                    <div
                      className={`option ${
                        userType === "user" ? "active" : ""
                      }`}
                      onClick={() => setUserType("user")}
                    >
                      User
                    </div>
                    <div
                      className={`option ${
                        userType === "company" ? "active" : ""
                      }`}
                      onClick={() => setUserType("company")}
                    >
                      Company
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    {selectedImage ? (
                      <img
                        src={selectedImage}
                        alt="Profile"
                        className="w-20 h-20 rounded-full object-cover mb-4"
                      />
                    ) : null}

                    <input
                      id="fileInput"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />

                    <button
                      onClick={handleClick}
                      className="px-4 py-2 bg-blue-500 text-black rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                      Upload Logo/Profile
                    </button>
                  </div>
                  <form
                    id="form"
                    className="company_form"
                    onSubmit={handleSubmitCompany}
                  >
                    {/* <div className="form-group">
                <input
                  type="text"
                  name="company role"
                  placeholder="company role"
                  value={credentials.name}
                  onChange={handleChange}
                  required
                />
              </div> */}

                    <div className="form-group">
                      <input
                        type="text"
                        name="cname"
                        placeholder="company Name"
                        value={credentials.cname}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        name="contact_name"
                        placeholder="Contact Person"
                        value={credentials.contact_name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={credentials.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="password"
                        name="password"
                        placeholder="password"
                        value={credentials.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="password"
                        name="cpassword"
                        placeholder="Confirm password"
                        value={credentials.cpassword}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <select
                        id="countrySelect"
                        value={selectedCountry}
                        onChange={handleCountryChange}
                      >
                        <option value="">Select a country:</option>
                        {countries.map((country, index) => (
                          <option key={index} name="country" value={country.id}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col form-group">
                      <select
                        id="countrySelect"
                        value={selectedState}
                        onChange={handleStateChange}
                      >
                        <option value="">Select Your Zone:</option>
                        {STATE.map((state, index) => (
                          <option
                            key={index}
                            name="service_location_id"
                            value={state.id}
                          >
                            {state.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <input
                        type="text"
                        name="address"
                        placeholder="address"
                        value={credentials.address}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    {/* <div className="form-group">
                      <input
                        type="text"
                        name="state"
                        placeholder="state"
                        value={credentials.state}
                        onChange={handleChange}
                        required
                      />
                    </div> */}
                    {/* <div className="form-group">
                      <input
                        type="text"
                        name="city"
                        placeholder="city"
                        value={credentials.city}
                        onChange={handleChange}
                        required
                      />
                    </div> */}
                    <div className="form-group">
                      <input
                        type="number"
                        name="mobile"
                        placeholder="Mobile Number"
                        value={credentials.mobile}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="number"
                        name="postal"
                        placeholder="postal code"
                        value={credentials.postal}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="flex justify-center md:translate-x-[50%]">
                      <div className="form-group cc001">
                        <button id="signup_btn_company" type="submit">
                          Sign Up as {userType}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default SignupPage;
