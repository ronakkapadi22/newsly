import React, { useState } from "react";
import { Avatar, Badge, IconButton, Menu, MenuItem } from "@material-ui/core";
import { BsFillBellFill } from 'react-icons/bs'
import "../style/navbar.css";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

const Navbar = () => {
  const history = useHistory()
  const userDetails = useSelector(({ userAuth }) => userAuth?.user);
  const [isOpenProfile, setIsOpenProfile] = useState(null);
  const [profile, setProfile] = useState(userDetails?.picture);

  const open = Boolean(isOpenProfile);
  const handleClick = (event) => {
    setIsOpenProfile(event.currentTarget);
  };
  const handleClose = () => {
    setIsOpenProfile(null);
  };

  useEffect(() => {
    if (userDetails?.picture) {
      setProfile(userDetails?.picture);
    }
  }, [userDetails]);

  const handleMenu = (path) => {
    setIsOpenProfile(null)
    history.push(`/dashboard/${path}`)
  }

  return (
    <div className="navbar">
      <div>
        <Badge className='notification-badge' color="secondary" badgeContent={10}>
          <BsFillBellFill className='notification' />
        </Badge>
        <IconButton
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          <Avatar alt="RK" src={profile} />
        </IconButton>
        <Menu
          id="basic-menu"
          anchorEl={isOpenProfile}
          open={open}
          onClose={handleClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          elevation={1}
          placement="bottom-start"
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem onClick={() => handleMenu('profile')} >Profile</MenuItem>
          <MenuItem onClick={() => handleMenu('my-account')}>My account</MenuItem>
          <MenuItem onClick={() => handleMenu('updates')}>Updates</MenuItem> 
        </Menu>
      </div>
    </div>
  );
};

export default Navbar;
