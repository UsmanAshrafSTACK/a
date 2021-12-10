import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import Avatar from "@mui/material/Avatar";
import { doc, onSnapshot } from "firebase/firestore";
import { app, db, auth, storage } from "./FirebaseConfig";
import { useState, useLayoutEffect, useEffect, useRef } from "react";
// import UpdateUser from "./UpdateUser";
import PictureInPictureIcon from "@mui/icons-material/PictureInPicture";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import { ref, uploadBytesResumable } from "firebase/storage";
import { getDownloadURL } from "@firebase/storage";
import ColorButtons from "./ColorButtons";
import Stack from "@mui/material/Stack";
import { height } from "@mui/system";
import { useNavigate } from "react-router-dom";
// import PostCard from "./PostCard";
import { onAuthStateChanged } from "firebase/auth";
import { collection, setDoc, query, where } from "firebase/firestore";
import { useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "./State/index";
import TextField from "@mui/material/TextField";
import Caption from "./Caption";
import Card from "@mui/material/Card";
import CardHeader from "./CardHeader";
import CardMain from "./CardMain";
import CardFooter from "./CardFooter";
import { updateDoc } from "firebase/firestore";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import ChangeCircleRoundedIcon from "@mui/icons-material/ChangeCircleRounded";
import { updateEmail } from "firebase/auth";


const Input = styled("input")({
  display: "none",
});

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function MiniDrawer() {
  const navigate = useNavigate();
  const [uid, setUID] = useState("");
  const [postDiv, setPostDiv] = useState(false);
  const [userDiv, setUserDiv] = useState(false);
  const [post, setPost] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [caption, setCaption] = useState("");
  const files = useRef("");
  const upFile = useRef("");
  const dispatch = useDispatch();
  const { uploadUserPost } = bindActionCreators(actionCreators, dispatch);
  const [changeName, setChangeName] = useState(false);
  const [changeLastName, setChangeLastName] = useState(false);
  const [changeEmail, setChangeEmail] = useState(false);
  const [changeGender, setChangeGender] = useState(false);
  const [changeNameVal, setChangeNameVal] = useState("");
  const [changeLastNameval, setChangeLastNameval] = useState("");
  const [changeGenderVal, setChangeGenderVal] = useState("");
  const [changeEmailVal , setChangeEmailVal] = useState("");
  // const [changeEmail , setChangeEmail] = useState(false)

  const updateProvidedData = (e, val) => {
    if (val.length >= 2 && val != userInfo[e.target.id]) {
      const updateRef = doc(db, "Accounts", uid);
      updateDoc(updateRef, {
        [e.target.id]: val,
      });
    }
  };

  const editUserEmail = (e,val) => {
    updateEmail(auth.currentUser, val).then(() => {
     alert("GO & CHECK")
    }).catch((error) => {
      alert("Please Write Correct Email To Change")
    });
  };

  const editBtn = () => {
    setChangeName(true);
  };
  const editBtnLastName = () => {
    setChangeLastName(true);
  };

  const editBtnEmail = () => {
    setChangeEmail(true);
  };

  const editBtnGender = () => {
    setChangeGender(true);
  };

  const editGender = (val) => {
    if (!changeGender) {
      return (
        <>
          <span>{val}</span>
          <EditRoundedIcon
            onClick={editBtnGender}
            style={{ marginLeft: "10px", fontSize: "20px" }}
          />
        </>
      );
    } else if (changeGender) {
      return (
        <>
          <select
            className="edit"
            id="gender"
            onChange={(e) => {
              setChangeGenderVal(e.target.value);
            }}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <button>Update</button>
          <ChangeCircleRoundedIcon
            id="gender"
            onClick={(e) => {
              updateProvidedData(e, changeGenderVal);
              setChangeGender(!changeGender);
            }}
          />
        </>
      );
    }
  };

  const editEmail = (val) => {
    if (!changeEmail) {
      return (
        <>
          <span>{val}</span>
          <EditRoundedIcon
            onClick={editBtnEmail}
            style={{ marginLeft: "10px", fontSize: "20px" }}
          />
        </>
      );
    } else if (changeEmail) {
      return (
        <>
          <input
            type="email"
            className="edit"
            onChange={(e) => {
              setChangeEmailVal(e.target.value);
            }}
          />
          <ChangeCircleRoundedIcon />
          <button 
          id="email"
          onClick={(e) => {
            editUserEmail(e, changeEmailVal);
            setChangeEmail(!changeEmail);
            console.log(changeEmailVal)
          }}
          >Update</button>
        </>
      );
    }
  };

  const editLastName = (val) => {
    if (!changeLastName) {
      return (
        <>
          <span>{val}</span>

          <EditRoundedIcon
            onClick={editBtnLastName}
            style={{ marginLeft: "10px", fontSize: "20px" }}
          />
        </>
      );
    } else if (changeLastName) {
      return (
        <>
          <input
            type="text"
            className="edit"
            onChange={(e) => {
              setChangeLastNameval(e.target.value);
            }}
          />
          <ChangeCircleRoundedIcon
            id="aa"
            onClick={(e) => {
              console.log(e.target.id);
            }}
          />
          <button
            id="lastName"
            onClick={(e) => {
              updateProvidedData(e, changeLastNameval);
              setChangeLastName(!changeLastName);
            }}
          >
            Update
          </button>
        </>
      );
    }
  };

  const edit = (val) => {
    if (!changeName) {
      return (
        <>
          <span className="span">{val}</span>
          <EditRoundedIcon
            onClick={editBtn}
            style={{ marginLeft: "10px", fontSize: "20px" }}
          />
        </>
      );
    } else if (changeName) {
      return (
        <>
          <input
            type="text"
            className="edit"
            onChange={(e) => {
              setChangeNameVal(e.target.value);
            }}
          />
          <ChangeCircleRoundedIcon
            id="firstName"
            onClick={(e) => {
              updateProvidedData(e, changeNameVal);
              setChangeName(!changeName);
            }}
          />
          <button>Update</button>
        </>
      );
    }
  };

  const UploadPost = () => {
    if (caption.length >= 1) {
      uploadUserPost(caption, files, uid);
      setPostDiv(!postDiv);
    } else {
      alert("Please Fill Caption To Post");
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setUID(uid);
        //// Getting User Info
        onSnapshot(doc(db, "Accounts", uid), (doc) => {
          setUserInfo(doc.data());
        });
        //// Getting User Info

        //// Getting User Posts
        onSnapshot(collection(db, "Accounts", uid, "post"), (snapShot) =>
          setPost(snapShot.docs.map((doc) => doc.data()))
        );
        //// Getting User Posts
      } else {
        navigate("/404");
      }
    });
  }, []);

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: "36px",
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            F R I E N D S
          </Typography>
          <Avatar
            alt="Trevor Henderson"
            style={{ left: "80%" }}
            src={userInfo.userPhoto}
            onClick={() => setUserDiv(!userDiv)}
          />
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {["Posts"].map((text, index) => (
            <ListItem
              key={index}
              button
              key={text}
              onClick={() => {
                if (!postDiv) {
                  setPostDiv(true);
                  setCaption("");
                }
              }}
            >
              <ListItemIcon>
                <Link to="/" className="link">
                  {<PictureInPictureIcon />}
                </Link>
              </ListItemIcon>
              <Link to="/" className="link">
                <ListItemText primary={text} />
              </Link>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {userDiv && (
          <div className="userDiv">
            <div className="userInfo">
              <input
                onClick={() => setUserDiv(!userDiv)}
                type="button"
                value="X"
                className="input"
              />
              <Avatar
                alt="Trevor Henderson"
                style={{ left: "80%" }}
                src={userInfo.userPhoto}
                style={{ left: "0%" }}
              />
              <div className="user">
                <p>First Name : {edit(userInfo.firstName)}</p>
                <p>Last Name : {editLastName(userInfo.lastName)}</p>
                <p>Email : {editEmail(userInfo.email)} </p>
                <p>Gender : {editGender(userInfo.gender)}</p>
              </div>
            </div>
          </div>
        )}
        {postDiv && (
          <div className="postDiv">
            <div className="postMain">
              <input
                type="button"
                value="X"
                className="input"
                onClick={() => {
                  if (postDiv) {
                    setPostDiv(false);
                  }
                }}
              />
              <TextField
                onChange={(e) => {
                  setCaption(e.target.value);
                }}
                id="caption"
                placeholder="Enter Your Caption Here"
                label="Caption"
                multiline
                style={{ width: "80%", margin: "20px" }}
                maxRows={20}
              />
              <Stack direction="row" alignItems="center" spacing={2}>
                <label htmlFor="contained-button-file">
                  <Input
                    accept="image/*"
                    ref={files}
                    id="contained-button-file"
                    type="file"
                  />
                  <Button
                    variant="contained"
                    component="span"
                    style={{ margin: "0px 20px" }}
                  >
                    Upload a Picture
                  </Button>
                </label>
              </Stack>
              <Stack
                direction="row"
                spacing={10}
                style={{ margin: "20px 0px" }}
              >
                <Button
                  style={{ margin: "0px 20px" }}
                  variant="contained"
                  color="success"
                  onClick={UploadPost}
                >
                  Upload A Post
                </Button>
              </Stack>
            </div>
          </div>
        )}
        <div className="allPost">
          {post.map((e, index) => (
            <Card sx={{ maxWidth: 345 }} key={index}>
              <CardHeader
                name={userInfo.firstName + " " + userInfo.lastName}
                time={e.dateString + " " + e.timeString}
                src={userInfo.userPhoto}
              />
              {e.postPicture !== "false" && <CardMain src={e.postPicture} />}
              <CardFooter caption={e.postCaption} />
            </Card>
          ))}
        </div>
      </Box>
    </Box>
  );
}
