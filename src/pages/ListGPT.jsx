import React, { useState, useEffect, useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import backgroundImage from "./../assets/ListGPT.jpg";

import { db } from "./../firebase/firebase";
import {
  query,
  getDocs,
  collection,
  where,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

import { getStorage, ref, deleteObject } from "firebase/storage";

import { toast } from "react-toastify";

const ListGPT = () => {
  const [order, setorder] = useState("Popular");
  const [gpts, setgpts] = useState([]);
  const [loading, setloading] = useState(false);
  const [origingpts, setorigingpts] = useState([]);
  const [searchString, setSearchString] = useState("");
  const password = "O+^1Vk27xNia";

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setloading(true);
        const gptsData = [];
        const q = query(collection(db, "gpts"));
        const docs = await getDocs(q);
        docs.forEach((doc) => {
          gptsData.push(doc.data());
        });

        setgpts(gptsData);
        setorigingpts(gptsData);
        setloading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const onSearchFromString = useCallback(() => {
    const filteredData = origingpts.filter((obj) =>
      Object.values(obj).some(
        (value) => typeof value === "string" && value.includes(searchString)
      )
    );
    return filteredData;
  }, [origingpts, searchString]);

  const onKeyDownSearch = (e) => {
    if (e.key) {
      if (searchString === "") {
        setgpts(origingpts);
        return;
      }

      setgpts(onSearchFromString());
    }
  };

  const truncateString = (str, num) => {
    if (str.length > num) {
      return str.slice(0, num);
    } else {
      return str;
    }
  };

  const handleGotoGPTURL = async (id, website) => {
    const gptCollection = collection(db, "gpts");

    const q = query(gptCollection, where("id", "==", id));
    const querySnapshot = await getDocs(q);

    const gptDoc = querySnapshot.docs[0];
    const gptData = gptDoc.data();

    const gptDocRef = doc(db, "gpts", gptDoc.id);
    await updateDoc(gptDocRef, {
      popular: gptData.popular + 1,
    });

    window.open(website, "_blank");
  };

  const handleGotoDevWebsite = (website) => {
    window.open(website, "_blank");
  };

  const handleDeleteGPT = async (id) => {
    const userInput = window.prompt(
      "For Edditing/ Deleting GPT's please contact help@customgpts.in."
    );
    if (userInput !== null && userInput.trim() === password) {
      setloading(true);
      try {
        setgpts([]);

        const gptCollection = collection(db, "gpts");

        const q = query(gptCollection, where("id", "==", id));
        const querySnapshot = await getDocs(q);
        const gptDoc = querySnapshot.docs[0];
        const gptDocRef = doc(db, "gpts", gptDoc.id);
        await deleteDoc(gptDocRef);

        const storage = getStorage();
        const storageRef = ref(storage, `images/${id}.jpg`);
        deleteObject(storageRef);

        toast.success("Successfully Deleted!", {
          hideProgressBar: true,
          autoClose: 500,
          closeButton: false,
        });

        setloading(false);

        setorigingpts((origingpts) =>
          origingpts.filter((gpt) => gpt.id !== id)
        );
      } catch (err) {
        console.log(err);
      }
    } else if (userInput !== null) {
      toast.warning(
        "Please input password correctly! Only admin can elete the customgpts.",
        {
          hideProgressBar: true,
          autoClose: 500,
          closeButton: false,
        }
      );
    }
  };

  const handleEditClick = (id) => {
    const userInput = window.prompt("Please enter password:");
    if (userInput !== null && userInput.trim() === password) {
      navigate(`/edit/${id}`);
    } else if (userInput !== null) {
      toast.warning(
        "Please input password correctly! Only admin can edit the customgpts.",
        {
          hideProgressBar: true,
          autoClose: 500,
          closeButton: false,
        }
      );
    }
  };

  useEffect(() => {
    if (order === "New") {
      let result = onSearchFromString();
      result.sort((a, b) => new Date(b.time) - new Date(a.time));
      setgpts(result);
    } else if (order === "All") {
      let result = onSearchFromString();
      setgpts(result);
    } else if (order === "Popular") {
      let result = onSearchFromString();
      result.sort((a, b) => b.popular - a.popular);
      setgpts(result);
    }
  }, [order, searchString, onSearchFromString, origingpts]);

  return (
    <div
      className="bg-center bg-cover h-screen overflow-x-hidden flex flex-col w-full overflow-y-auto pb-[20px] custom-scrollbar"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div>
        <div className="text-white text-[40px] sm:text-[60px] font-bold  w-full mt-[40px] flex justify-center">
          <NavLink to="/">
            <span className="bg-gradient-to-r bg-clip-text text-transparent from-pink-500 via-purple-500 to-indigo-500">
              Custom GPT's
            </span>{" "}
            Store
          </NavLink>
        </div>
        <div className="mx-[50px]">
          <div className="mt-[10px] flex flex-col sm:items-center sm:flex-row justify-between sm:space-x-[30px]">
            <div className="flex items-center space-x-2 sm:space-x-[10px]">
              <div>
                {order === "Popular" && (
                  <div className="bg-[#202123] w-[300px]  my-[20px] rounded-md flex flex-row p-[4px] space-x-2 text-[15px] relative border-[#61626D] border-[1px]">
                    <div
                      onClick={() => setorder("Popular")}
                      className="bg-[#353740] hover:border-[#61626D] rounded-md px-[2.5px] py-[5px] w-[100px] border border-[#61626D] flex flex-row justify-center items-center hover:cursor-pointer"
                    >
                      <span className="text-white font-medium">Popular</span>
                    </div>
                    <div
                      onClick={() => setorder("New")}
                      className="bg-[#202123] hover:border-[#353740] rounded-md px-[2.5px] py-[5px] w-[100px] border border-[#202123] flex flex-row justify-center items-center hover:cursor-pointer"
                    >
                      <span className="text-white font-medium">New</span>
                    </div>
                    <div
                      onClick={() => setorder("All")}
                      className="bg-[#202123] hover:border-[#353740] rounded-md px-[2.5px] py-[5px] w-[100px] border border-[#202123] flex flex-row justify-center items-center hover:cursor-pointer"
                    >
                      <span className="text-white font-medium">All</span>
                    </div>
                  </div>
                )}
                {order === "New" && (
                  <div className="bg-[#202123] w-[300px]  my-[20px] rounded-md flex flex-row p-[4px] space-x-2 text-[15px] relative border-[#61626D] border-[1px]">
                    <div
                      onClick={() => setorder("Popular")}
                      className="bg-[#202123] rounded-md hover:border-[#353740] px-[2.5px] py-[5px] w-[100px] border border-[#202123] flex flex-row justify-center items-center hover:cursor-pointer"
                    >
                      <span className="text-white font-medium">Popular</span>
                    </div>
                    <div
                      onClick={() => setorder("New")}
                      className="bg-[#353740] rounded-md hover:border-[#61626D] px-[2.5px] py-[5px] w-[100px] border border-[#61626D] flex flex-row justify-center items-center hover:cursor-pointer"
                    >
                      <span className="text-white font-medium">New</span>
                    </div>
                    <div
                      onClick={() => setorder("All")}
                      className="bg-[#202123] rounded-md hover:border-[#353740] px-[2.5px] py-[5px] w-[100px] border border-[#202123] flex flex-row justify-center items-center hover:cursor-pointer"
                    >
                      <span className="text-white font-medium">All</span>
                    </div>
                  </div>
                )}
                {order === "All" && (
                  <div className="bg-[#202123] w-[300px]  my-[20px] rounded-md flex flex-row p-[4px] space-x-2 text-[15px] relative border-[#61626D] border-[1px]">
                    <div
                      onClick={() => setorder("Popular")}
                      className="bg-[#202123] rounded-md hover:border-[#353740] px-[2.5px] py-[5px] w-[100px] border border-[#202123] flex flex-row justify-center items-center hover:cursor-pointer"
                    >
                      <span className="text-white font-medium">Popular</span>
                    </div>
                    <div
                      onClick={() => setorder("New")}
                      className="bg-[#202123] rounded-md hover:border-[#353740] px-[2.5px] py-[5px] w-[100px] border border-[#202123] flex flex-row justify-center items-center hover:cursor-pointer"
                    >
                      <span className="text-white font-medium">New</span>
                    </div>
                    <div
                      onClick={() => setorder("All")}
                      className="bg-[#353740] rounded-md hover:border-[#61626D] px-[2.5px] py-[5px] w-[100px] border border-[#61626D] flex flex-row justify-center items-center hover:cursor-pointer"
                    >
                      <span className="text-white font-medium">All</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <input
                  className="pl-[39px] w-[310px] py-[11px] outline-none focus:border-[#61626D] rounded-lg border-[#61626D] border-[1px]  focus:border-[1px] focus:shadow-custom_login bg-[#1A1D21] text-white text-[14px]"
                  placeholder="GPT's Search"
                  name="name"
                  onChange={(e) => {
                    setSearchString(e.target.value);
                    if (searchString === "") {
                      setgpts(origingpts);
                      return;
                    }

                    setgpts(onSearchFromString());
                  }}
                  onKeyDown={onKeyDownSearch}
                />
                <i className="absolute fa-solid fa-magnifying-glass top-[15px] left-[15px] text-[#aaaaaa]"></i>
              </div>
            </div>
            <div>
              <NavLink
                to="/add"
                className="w-[310px] py-[9px] mt-[20px] sm:mt-[0px] bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white hover:from-pink-600 hover:to-indigo-600 rounded-lg  font-medium text-[18px] flex justify-center items-center"
              >
                List your GPT's For Free
              </NavLink>
            </div>
          </div>

          <div className="container mx-auto p-4">
            {loading ? (
              <div className="w-full flex justify-center items-center mt-[180px]">
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="w-[45px] h-[45px] text-gray-200 animate-spin dark:text-gray-600 fill-pink-500 font-bold "
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
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-[20px] mx-[50px] mt-[-35px]">
        {gpts.map((gpt, index) => (
          <div
            key={index}
            className="w-full h-[240px] bg-[#111111] rounded-lg mt-[0px] relative"
          >
            <div className="flex items-center w-full">
              <img
                src={gpt.image}
                alt="back"
                className="w-1/4 rounded-lg m-[10px]"
              />
              <div className="flex flex-col w-3/4 items-start">
                <span className="text-[#cccccc] text-[15px] ml-0 my-[6px] font-bold w-[200px]">
                  {truncateString(gpt.name, 18)}
                </span>
                <div className="text-white w-[100px] justify-center">
                  <button
                    onClick={(e) => handleGotoGPTURL(gpt.id, gpt.url)}
                    className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white hover:from-pink-600 hover:to-indigo-600 rounded-lg h-[30px]  font-medium text-[16px] flex justify-center items-center"
                  >
                    Open GPT
                  </button>
                </div>
              </div>
            </div>
            <div className="text-[#bbbbbb] m-[20px] mt-[10px] w-[90%] break-words text-[12px]">
              <div>{truncateString(gpt.description, 170)}</div>
            </div>
            <div className="absolute left-[10px] bottom-[10px] w-[14  0px] gap-2 rounded-lg h-[40px] text-white justify-between items-center flex p-[10px]">
              <span className="text-[12px]">Developer info</span>
              <span
                className="cursor-pointer"
                onClick={(e) => handleGotoDevWebsite(gpt.website)}
              >
                <i className="fa-solid fa-globe text-[12px]"></i>
              </span>

              <NavLink to={`mailto:${gpt.email}`}>
                <span className="cursor-pointer">
                  <i className="fa-solid fa-envelope text-[12px]"></i>
                </span>
              </NavLink>
            </div>
            <div className="absolute right-[20px] bottom-[20px] space-x-[10px] text-white">
              <span
                className="cursor-pointer"
                onClick={(e) => {
                  handleEditClick();
                }}
              >
                <i className="fa-solid fa-pencil text-[12px]"></i>
              </span>

              <span
                className="cursor-pointer"
                onClick={(e) => handleDeleteGPT(gpt.id)}
              >
                <i className="fa-solid fa-trash text-[12px]"></i>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListGPT;
