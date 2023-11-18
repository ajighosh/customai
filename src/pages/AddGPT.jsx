import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import moment from "moment-timezone";
import { db } from "./../firebase/firebase";
import { query, getDocs, collection, where, addDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import backgroundImage from "./../assets/AddGPT.jpg";
import { v4 as uuidv4 } from "uuid";

import {
  getStorage,
  uploadBytesResumable,
  ref,
  getDownloadURL,
} from "firebase/storage";

const AddGPT = () => {
  const [values, setValues] = useState({
    name: "",
    description: "",
    url: "",
    email: "",
    website: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setloading] = useState(false);

  const onSubmit = async (e) => {
    if (
      values.name === "" ||
      values.description === "" ||
      values.url === "" ||
      values.email === "" ||
      values.website === "" ||
      selectedImage === null
    ) {
      toast.warning("Please input the whole files exactly!", {
        hideProgressBar: true,
        autoClose: 500,
        closeButton: false,
      });
      return;
    }
    setloading(true);
    let idVal = uuidv4();

    if (selectedImage) {
      const storage = getStorage();
      const storageRef = ref(storage, `images/${idVal}.jpg`);

      const metadata = {
        contentType: "image/jpeg",
      };

      const uploadTask = uploadBytesResumable(
        storageRef,
        selectedImage,
        metadata
      );
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {},
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            const formattedTime = moment()
              .tz("America/Los_Angeles")
              .format("YYYY-MM-DD HH:mm:ss");
            addDoc(collection(db, "gpts"), {
              id: idVal,
              ...values,
              image: downloadURL,
              popular: 0,
              time: formattedTime,
            })
              .then((res) => {
                console.log(res.data);
                setloading(false);
                toast.success("Successfully Added!", {
                  hideProgressBar: true,
                  autoClose: 500,
                  closeButton: false,
                });
              })
              .catch((err) => {
                console.log(err);
              });
          });
        }
      );
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    console.log(file);
    setSelectedImage(file);
  };

  const handleUpload = async () => {};

  return (
    <div
      className="bg-cover bg-center h-screen flex flex-row justify-between w-full"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="flex flex-col w-full lg:w-full justify-center">
        <div className="mx-[70px] md:mx-[300px]">
          <div className="text-[50px] font-bold text-white">
            Add{" "}
            <span className="bg-gradient-to-r bg-clip-text text-transparent from-pink-500 via-purple-500 to-indigo-500">
              Custom GPT
            </span>
          </div>
          <div className="text-[#9B9C9E] mt-[20px] text-[18px]">
            Please add Custom GPT
          </div>
          <div className="flex flex-col">
            <div className="relative">
              <input
                className="w-full mt-[20px] pl-[36px]  rounded-[8px] border-[1px] border-[#363A3D]  focus:border-[1px] focus:shadow-custom_login focus:border-[#82DBF7] h-[42px] bg-[#1A1D21] text-white text-[16px] p-[18px]"
                placeholder="GPT Name"
                name="name"
                onChange={(e) =>
                  setValues((values) => ({
                    ...values,
                    [e.target.name]: e.target.value,
                  }))
                }
              />
              <i
                className="absolute left-3 top-[33px] fa-solid fa-file-signature"
                aria-hidden="true"
              ></i>
            </div>

            <div className="relative">
              <input
                className="w-full mt-[10px] pl-[36px]  rounded-[8px] border-[1px] border-[#363A3D]  focus:border-[1px] focus:shadow-custom_login focus:border-[#82DBF7] h-[42px] bg-[#1A1D21] text-white text-[16px] p-[18px]"
                placeholder="Description"
                name="description"
                onChange={(e) =>
                  setValues((values) => ({
                    ...values,
                    [e.target.name]: e.target.value,
                  }))
                }
              />
              <i
                className="absolute left-3 top-[23px] fa fa-solid fa-file-waveform"
                aria-hidden="true"
              ></i>
            </div>

            <div className="relative">
              <input
                className="w-full mt-[10px] pl-[36px]  rounded-[8px] border-[1px] border-[#363A3D]  focus:border-[1px] focus:shadow-custom_login focus:border-[#82DBF7] h-[42px] bg-[#1A1D21] text-white text-[16px] p-[18px]"
                placeholder="GPT URL"
                name="url"
                onChange={(e) =>
                  setValues((values) => ({
                    ...values,
                    [e.target.name]: e.target.value,
                  }))
                }
              />
              <i
                className="absolute left-3 top-[23px] fa fa-brands fa-gripfire"
                aria-hidden="true"
              ></i>
            </div>

            <div className="relative">
              <input
                className="w-full mt-[10px] pl-[36px]  rounded-[8px] border-[1px] border-[#363A3D]  focus:border-[1px] focus:shadow-custom_login focus:border-[#82DBF7] h-[42px] bg-[#1A1D21] text-white text-[16px] p-[18px]"
                placeholder="Developer Email"
                name="email"
                onChange={(e) =>
                  setValues((values) => ({
                    ...values,
                    [e.target.name]: e.target.value,
                  }))
                }
              />
              <i
                className="absolute left-3 top-[23px] fa fa-solid fa-envelope"
                aria-hidden="true"
              ></i>
            </div>

            <div className="relative">
              <input
                className="w-full mt-[10px] pl-[36px]  rounded-[8px] border-[1px] border-[#363A3D]  focus:border-[1px] focus:shadow-custom_login focus:border-[#82DBF7] h-[42px] bg-[#1A1D21] text-white text-[16px] p-[18px]"
                placeholder="Developer profile URL"
                name="website"
                onChange={(e) =>
                  setValues((values) => ({
                    ...values,
                    [e.target.name]: e.target.value,
                  }))
                }
              />
              <i
                className="absolute left-3 top-[23px] fa fa-solid fa-file-pen"
                aria-hidden="true"
              ></i>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="file"
              id="image-file"
              className="hidden"
              onChange={handleImageUpload}
            />
            <button
              onClick={(e) => document.getElementById("image-file").click()}
              className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white hover:from-pink-600 hover:to-indigo-600  rounded-[12px] h-[48px] w-[200px] mt-[10px] font-medium  border-0 text-[16px] flex justify-center items-center"
            >
              Image Upload
            </button>
            <div className="text-white">{selectedImage?.name}</div>
          </div>

          <button
            onClick={onSubmit}
            className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white hover:from-pink-600 hover:to-indigo-600  rounded-[12px] h-[48px] w-full mt-[30px] font-medium  border-0 text-[16px] flex justify-center items-center"
          >
            {loading ? (
              <svg
                aria-hidden="true"
                class="w-[30px] h-[30px] text-gray-200 animate-spin dark:text-gray-600 fill-white font-bold "
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            ) : (
              <span className="text-[18px]">Add</span>
            )}
          </button>
        </div>
        <div className="ml-[70px] sm:ml-[300px] mt-[20px] text-[16px]">
          <span className="mr-[16px] text-[#686B6E] font-medium ">
            Go to GPT Store
          </span>
          <NavLink to="/list" className="text-white">
            <span>GPT Store</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default AddGPT;
