import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FormControl, Nav, Modal, Row, Col, Dropdown, Badge, Navbar, InputGroup } from 'react-bootstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { MENUITEMS } from '../sidebar/sidemenu';
import { connect } from "react-redux";  
import { shopingData } from '../../data/data-ecommerce/datashoppingcart';
import { AddToCart } from '../../redux/action';
import { useRouter } from 'next/router';
import axios from 'axios';

//leftsidemenu
const SideMenuIcon = () => {
  document.querySelector(".app").classList.toggle("sidenav-toggled");
};

// Darkmode
const DarkMode = () => {
  if(document.querySelector(".app").classList.contains('dark-mode')){
    document.querySelector(".app").classList.remove('dark-mode');
    let DarkMenu1 = document.querySelector("#myonoffswitch1");
    DarkMenu1.checked = true;
  }
  else{
    document.querySelector(".app").classList.add('dark-mode');
    let DarkMenu1 = document.querySelector("#myonoffswitch2");
    DarkMenu1.checked = true;
  }
};

// FullScreen
var i = true;
const Fullscreen = (vale) => {
  // var elem = document.documentElement;
  switch (vale) {
    case true:
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.webkitRequestFullscreen) { /* Safari */
        document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) { /* IE11 */
        document.documentElement.msRequestFullscreen();
      }
      i = false;
      break;
    case false:
      document.exitFullscreen();
      i = true;
      break;
    default:
      break;
  }
};

// SwitcherMenu

const SidSwitcherIcon = () => {

  //leftsidemenu
  document.querySelector(".demo_changer").classList.toggle("active");
  let Rightside = document.querySelector(".demo_changer");
  Rightside.style.right = "0px";

};

const RightSideBar = () => {

  //rightsidebar
  document.querySelector(".sidebar-right").classList.toggle("sidebar-open");
  //swichermainright
};

const Header = ({ localVaraiable }) => {

  let { basePath } = useRouter();

  // For CountrySelector Modal
  const [userData, setUserData] = useState(null);
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [InputValue, setInputValue] = useState("");
  const [searchval, setsearchval] = useState("Type something");
  const [searchcolor, setsearchcolor] = useState("text-dark");
  const [NavData, setNavData] = useState([]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // let navigate = useNavigate();
  let myfunction = (inputvalue) => {
    document.querySelector(".search-result").classList.remove("d-none");
    // console.log('ok');

    let i = [];
    let allElement2 = [];

    MENUITEMS.map(mainlevel => {
      if (mainlevel.Items) {
        mainlevel.Items.map(sublevel => {
          // console.log("sublevel --- ", sublevel)
          if (sublevel.children) {
            sublevel.children.map(sublevel1 => {
              // console.log("sublevel1 --- ", sublevel1)
              i.push(sublevel1);
              if (sublevel1.children) {
                sublevel1.children.map(sublevel2 => {
                  // console.log("sublevel2 --- ", sublevel2)
                  i.push(sublevel2);
                  return sublevel2;
                });
              }
              return sublevel1;
            });
          }
          return sublevel;
        });
      }
      return mainlevel;

    }
    );
    for (let allElement of i) {
      if (allElement.title.toLowerCase().includes(inputvalue.toLowerCase())) {
        if (allElement.title.toLowerCase().startsWith(inputvalue.toLowerCase())) {
          setShow2(true);
          allElement2.push(allElement);
        }
      }
    }
    if (!allElement2.length || inputvalue === "") {
      if (inputvalue === "") {
        setShow2(false);
        setsearchval("Type something");
        setsearchcolor('text-dark');
      }
      if (!allElement2.length) {
        setShow2(false);
        setsearchcolor('text-danger');
        setsearchval("There is no component with this name");
      }
    }
    setNavData(allElement2);

  };

  // let location = useLocation();

  const [FiltershopingData, sethopingData] = useState([]);
	const [Price, setPrice] = useState(0);

	useEffect(() => {
    document.querySelector('.main-content')?.addEventListener('click', () => {
      document.querySelector(".search-result")?.classList.add("d-none");
    });
		if (localVaraiable == undefined) {
			sethopingData(shopingData);
			shopingData.filter((ele) => {
				setPrice(Number(ele.newprice) + Price);
			});
		}
		else if (localVaraiable.length == 0) {
			sethopingData(shopingData);
			shopingData.filter((ele) => {
				setPrice(Number(ele.newprice) + Price);
			});
		}
		else {
			sethopingData(localVaraiable);
			localVaraiable.filter((ele) => {
				setPrice(Number(ele.newprice) + Price);
			});
		}

	},[Price, localVaraiable]);

  // Fetching Me
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/authentication/me');
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.post('/api/authentication/logout');

      if (response.status === 200) {
        router.push('/authentication/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (

    <div>

      <div className='header sticky app-header header1'>
        <div className="container-fluid main-container">
          <div className="d-flex">
            <Link aria-label="Hide Sidebar" className="app-sidebar__toggle" data-bs-toggle="sidebar" href="#!" onClick={() => SideMenuIcon()} />
            <Link className="logo-horizontal " href={`/components/dashboard/dashboard/`}>
              <img src={`${process.env.NODE_ENV === 'production'? basePath : ''}/assets/images/brand/logo-white.png`} className="header-brand-img desktop-logo" alt="logo" />
              <img src={`${process.env.NODE_ENV === 'production'? basePath : ''}/assets/images/brand/logo-dark.png`} className="header-brand-img light-logo1" alt="logo" />
            </Link>
            <div className="main-header-center ms-3 d-none d-lg-block">
              <FormControl onChange={(ele => { myfunction(ele.target.value); setInputValue(ele.target.value); })} onClick={() => { setShow1(true); }} placeholder="Search for results..." type="search" />
              <button className='btn px-0 pt-2'><i className="fe fe-search" aria-hidden="false"></i></button>
              {show1 ?
                <div className="card search-result p-absolute w-100 card border mt-1">
                  <div className="card-header">
                    <h4 className="card-title me-2 text-break">Search result of {`${InputValue}`}</h4>
                  </div>
                  <ul className='card-body list-group'>
                    {show2 ?
                      NavData.map((e) =>
                        <li key={Math.random()}>
                          <Link className='list-group-item' href={`${e.path}/`}>{e.title}</Link>
                        </li>
                      )
                      : <b className={`${searchcolor} errortextHilight list-group-item`}>{searchval}</b>}
                  </ul>

                </div>
                : ""}
            </div>

            <Navbar className="d-flex order-lg-2 ms-auto header-right-icons">
              <Dropdown className="dropdown d-none" >
                <Link href="#!" className="nav-link icon " >
                  <i className="fe fe-search"></i>
                </Link>
                <Dropdown.Menu className="header-search dropdown-menu-start ">
                  <InputGroup className="input-group w-100 p-2">
                    <FormControl type="text" placeholder="Search...." />
                    <InputGroup.Text className="btn btn-primary">
                      <i className="fe fe-search" aria-hidden="true"></i>
                    </InputGroup.Text>
                  </InputGroup>
                </Dropdown.Menu>
              </Dropdown>
              <Navbar.Toggle className="d-lg-none ms-auto header2 navbar-toggler navresponsive-toggler" >
                <span className="navbar-toggler-icon fe fe-more-vertical"></span>
              </Navbar.Toggle>

              <div className="responsive-navbar navbar p-0">

                <Navbar.Collapse className="" id="navbarSupportedContent-4">
                  <div className="d-flex order-lg-2">
                    <Dropdown className="d-lg-none d-flex" >
                      <Dropdown.Toggle href="#!" className="nav-link icon no-caret" >
                        <i className="fe fe-search"></i>
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="header-search dropdown-menu-start">
                        <InputGroup className="w-100 p-2">
                          <FormControl type="text" placeholder="Search...." />
                          <InputGroup.Text>
                            <i className="fa fa-search" aria-hidden="true" ></i>
                          </InputGroup.Text>
                        </InputGroup>
                      </Dropdown.Menu>
                    </Dropdown>
                    {/* Dark Mode */}
                    <div className="dropdown">
                      <Nav.Link className="nav-link icon theme-layout nav-link-bg layout-setting"  onClick={() => DarkMode()}>
                        <span className="dark-layout"><i className="fe fe-moon"></i></span>
                        <span className="light-layout"><i className="fe fe-sun"></i></span>
                      </Nav.Link>
                    </div>
                    {/* FullScreen button */}
                    <div className="dropdown">
                      <Nav.Link className="nav-link icon full-screen-link nav-link-bg" onClick={() => Fullscreen(i)}>
                        <i className="fe fe-minimize fullscreen-button"></i>
                      </Nav.Link>
                    </div>
                    {/* Profile  */}
                    <Dropdown className="profile-1">
                      <Dropdown.Toggle variant='' className="nav-link leading-none d-flex no-caret">
                        <img src={`${process.env.NODE_ENV === 'production'? basePath : ''}/assets/images/users/21.jpg`}alt="profile-user"
                          className="avatar  profile-user brround cover-image" />
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="dropdown-menu-end dropdown-menu-arrow">
                        <div className="drop-heading">
                          <div className="text-center">
                            <h5 className="text-dark mb-0 fs-14 fw-semibold">{userData?.sun}</h5>
                            <small className="text-muted">{userData?.role}</small>
                          </div>
                        </div>
                        <div className="dropdown-divider m-0"></div>
                        <Link className="dropdown-item" href={`/`} onClick={handleLogout}>
                          <i className="dropdown-icon fe fe-alert-circle"></i> Sign out
                        </Link>
                      </Dropdown.Menu>
                    </Dropdown>

                  </div>
                </Navbar.Collapse>
              </div>
            </Navbar>
          </div>
        </div>
      </div>
    </div>
  );

};
const mapStateToProps = (state) => ({
  localVaraiable: state,
});
export default connect(mapStateToProps, {AddToCart})(Header);
