import PageHeader from '@/shared/layout-components/pageheader/pageHeader'
import Seo from '@/shared/layout-components/seo/seo'
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { Badge, Button, Card, Col, Dropdown, FormControl, Image, InputGroup, Nav, Row, Tab } from 'react-bootstrap'
import PerfectScrollbar from 'react-perfect-scrollbar';

const Chat = () => {
  const avatarUrl = process.env.NEXT_PUBLIC_AVATAR_URL;
  const [userData, setUserData] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState('');

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

  return (
    <div>
      <Seo title="Chat"/>
      <PageHeader titles="Chat" active="Chat" items={['Apps']} />
      <Row className="row-sm">
        <Col sm={12} md={12} lg={12} xxl={4}>
          <Card className="overflow-hidden">
            <div className="main-content-app pt-0 main-chat-2">
              <PerfectScrollbar>
                <div className="main-content-left main-content-left-chat">
                  <Card.Body className="d-flex align-items-center">
                    <div className="main-img-user online">
                      {userData && userData.photo ? (
                          <img alt="avatar" src={avatarUrl+userData.photo} />
                        ) : (
                          <div className="avatar avatar-md brround bg-primary-transparent text-primary">{userData?.sun.trim().charAt(0)}</div>
                      )}
                    </div>
                    <div className="main-chat-msg-name">
                      <h6>{userData?.sun}</h6>
                      {/* <span className="dot-label bg-success"></span><small className="me-3">Available</small> */}
                    </div>
                  </Card.Body>

                  <Card.Body>
                    <InputGroup>
                      <FormControl type="text" placeholder="Search ..." />
                      <Button variant="primary" className="input-group-text">Search</Button>
                    </InputGroup>
                  </Card.Body>

                  <Tab.Container id="left-tabs-example" defaultActiveKey="msg">
                    <Nav variant="pills" className="px-4" >
                      <Nav.Item>
                        <Nav.Link eventKey="msg">Messages</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="cnts">Contacts</Nav.Link>
                      </Nav.Item>
                    </Nav>
                    <Tab.Content className=' main-chat-list flex-2'>
                      <Tab.Pane eventKey="msg">
                        <div className="main-chat-list tab-pane">
                          <Link className="media selected mt-2" href="#!">
                            <div className="main-img-user online"><img alt="user9" src={"../../../assets/images/users/9.jpg"} /></div>
                            <div className="media-body">
                              <div className="media-contact-name">
                                <span>Reynante Labares</span> <span>9.40 am</span>
                              </div>
                              <p> Nice to meet you </p>
                            </div>
                          </Link>
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="cnts">
                        <div>
                          <div className="py-4 px-6 fw-bold">A</div>
                          <div className="d-flex align-items-center media">
                            <div className="mb-0 me-2">
                              <div className="main-img-user online">
                                <img alt="user3" src="../../../assets/images/legalnowy.png" />
                              </div>
                            </div>
                            <div className="align-items-center justify-content-between">
                              <div className="media-body ms-2">
                                <div className="media-contact-name">
                                  <span>Legalnowy</span>
                                  <span></span>
                                </div>
                              </div>
                            </div>
                            <div className="ms-auto">
                              <i className="contact-status text-primary fe fe-message-square me-2"></i>
                              <i className="contact-status text-success fe fe-phone-call me-2"></i>
                              <i className="contact-status text-danger fe fe-video me-2"></i>
                            </div>
                          </div>
                        </div>
                    </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                </div>
              </PerfectScrollbar>
            </div>
          </Card>
        </Col>
        {selectedRoom ? (
          <Col sm={12} md={12} lg={12} xxl={8}>
            <Card>
              <div className="main-content-app pt-0">
                <div className="main-content-body main-content-body-chat h-100">
                  <div className="main-chat-header pt-3 d-block d-sm-flex">
                    <div className="main-img-user online"><img alt="avatar" src={"../../../assets/images/users/1.jpg"} /></div>
                    <div className="main-chat-msg-name mt-2">
                      <h6>Saul Goodmate</h6>
                      <span className="dot-label bg-success"></span><small className="me-3">online</small>
                    </div>
                    <Nav>
                      <div className="">
                        <InputGroup>
                          <FormControl type="text" placeholder="Search ..." />
                          <InputGroup.Text className="btn bg-white text-muted border-start-0"><i className="fe fe-search"></i></InputGroup.Text>
                        </InputGroup>
                      </div>
                      <Dropdown>
                        <Dropdown.Toggle className="text-muted fs-20 no-caret" as="a"><i className="fe fe-more-horizontal mx-3"></i></Dropdown.Toggle>
                        <Dropdown.Menu className="dropdown-menu-end">
                          <Dropdown.Item href="#!"><i className="fe fe-phone-call me-1"></i> Phone Call</Dropdown.Item>
                          <Dropdown.Item href="#!"><i className="fe fe-video me-1"></i> Video Call</Dropdown.Item>
                          <Dropdown.Item href="#!"><i className="fe fe-user-plus me-1"></i> Add Contact</Dropdown.Item>
                          <Dropdown.Item href="#!"><i className="fe fe-trash-2 me-1"></i> Delete</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </Nav>
                  </div>
                  {/* <!-- main-chat-header --> */}
                  <div className="main-chat-body flex-2" id="ChatBody">
                    <PerfectScrollbar>
                      <div className="content-inner">
                        <label className="main-chat-time"><span>2 days ago</span></label>
                        <div className="media chat-left">
                          <div className="main-img-user online"><img alt="avatar" src={"../../../assets/images/users/1.jpg"} /></div>
                          <div className="media-body">
                            <div className="main-msg-wrapper">
                              Hey, Jhon Doe 👋<br/>
                              Saya Legalnowy, asisten AI pribadi Anda. Mari mulai dengan memilih topik atau sampaikan permintaan Anda.<br/>
                              Apakah ada yang bisa saya bantu hari ini?
                              <div className='btn-list mt-4'>
                                <Link href="#!" className="btn btn-outline-primary btn-sm">CAN (Code Anything Now)</Link>
                                <Link href="#!" className="btn btn-outline-primary btn-sm">Refactoring Assistant</Link>
                                <Link href="#!" className="btn btn-outline-primary btn-sm">Python Compiller</Link>
                                <Link href="#!" className="btn btn-outline-primary btn-sm">Linux Terminal</Link><br/>
                                <Link href="#!" className="btn btn-outline-primary btn-sm">Back-end developer</Link>
                                <Link href="#!" className="btn btn-outline-primary btn-sm">Swift developer</Link>
                                <Link href="#!" className="btn btn-outline-primary btn-sm">Front-end developer</Link>
                              </div>
                            </div>
                            <div>
                              <span>9:32 am</span> <Link href=""><i className="icon ion-android-more-horizontal"></i></Link>
                            </div>
                          </div>
                        </div>
                        <div className="media flex-row-reverse chat-right">
                          <div className="main-img-user online"><img alt="avatar" src={"../../../assets/images/users/21.jpg"} /></div>
                          <div className="media-body">
                            <div className="main-msg-wrapper">
                              Nulla consequat massa quis enim. Donec pede justo, fringilla vel...
                            </div>
                            <div className="main-msg-wrapper">
                              rhoncus ut, imperdiet a, venenatis vitae, justo...
                            </div>
                            <div>
                              <span>9:48 am</span> <Link href=""><i className="icon ion-android-more-horizontal"></i></Link>
                            </div>
                          </div>
                        </div>
                        <div className="media chat-left">
                          <div className="main-img-user online"><img alt="avatar" src={"../../../assets/images/users/1.jpg"} /></div>
                          <div className="media-body">
                            <div className="main-msg-wrapper">
                              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
                            </div>
                            <div>
                              <span>9:32 am</span> <Link href=""><i className="icon ion-android-more-horizontal"></i></Link>
                            </div>
                          </div>
                        </div>
                        <div className="media flex-row-reverse chat-right">
                          <div className="main-img-user online"><img alt="avatar" src={"../../../assets/images/users/21.jpg"} /></div>
                          <div className="media-body">
                            <div className="main-msg-wrapper">
                              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor
                            </div>
                            <div className="main-msg-wrapper">
                              <span className="text-dark"><span><i className="fa fa-image fs-14 text-muted pe-2"></i></span><span className="fs-14 mt-1"> Image_attachment.jpg </span>
                                <i className="fe fe-download mt-3 text-muted ps-2"></i>
                              </span>
                            </div>
                            <div>
                              <span>11:22 am</span> <Link href=""><i className="icon ion-android-more-horizontal"></i></Link>
                            </div>
                          </div>
                        </div>
                        <label className="main-chat-time"><span>Yesterday</span></label>
                        <div className="media chat-left">
                          <div className="main-img-user online"><img alt="avatar" src={"../../../assets/images/users/1.jpg"} /></div>
                          <div className="media-body">
                            <div className="main-msg-wrapper">
                              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
                            </div>
                            <div>
                              <span>9:32 am</span> <Link href=""><i className="icon ion-android-more-horizontal"></i></Link>
                            </div>
                          </div>
                        </div>
                        <div className="media flex-row-reverse chat-right">
                          <div className="main-img-user online"><img alt="avatar" src={"../../../assets/images/users/21.jpg"} /></div>
                          <div className="media-body">
                            <div className="main-msg-wrapper">
                              Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.
                            </div>
                            <div className="main-msg-wrapper">
                              Nullam dictum felis eu pede mollis pretium
                            </div>
                            <div>
                              <span>9:48 am</span> <Link href=""><i className="icon ion-android-more-horizontal"></i></Link>
                            </div>
                          </div>
                        </div><label className="main-chat-time"><span>Today</span></label>
                        <div className="media chat-left">
                          <div className="main-img-user online"><img alt="avatar" src={"../../../assets/images/users/1.jpg"} /></div>
                          <div className="media-body">
                            <div className="main-msg-wrapper">
                              Maecenas tempus, tellus eget condimentum rhoncus
                            </div>
                            <div className="main-msg-wrapper">
                              <img alt="avatar" className="w-10 h-10 me-1" src={"../../../assets/images/media/3.jpg"} />
                              <img alt="avatar" className="w-10 h-10 me-1" src={"../../../assets/images/media/4.jpg"} />
                              <img alt="avatar" className="w-10 h-10 me-1" src={"../../../assets/images/media/5.jpg"} />
                            </div>
                            <div>
                              <span>10:12 am</span> <Link href=""><i className="icon ion-android-more-horizontal"></i></Link>
                            </div>
                          </div>
                        </div>
                        <div className="media flex-row-reverse chat-right">
                          <div className="main-img-user online"><img alt="avatar" src={"../../../assets/images/users/21.jpg"} /></div>
                          <div className="media-body">
                            <div className="main-msg-wrapper">
                              Maecenas tempus, tellus eget condimentum rhoncus
                            </div>
                            <div className="main-msg-wrapper">
                              Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus.
                            </div>
                            <div>
                              <span>09:40 am</span> <Link href=""><i className="icon ion-android-more-horizontal"></i></Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </PerfectScrollbar>
                  </div>
                  <div className="main-chat-footer">
                    <input className="form-control" placeholder="Type your message here..." type="text" />
                    <Link className="nav-link" data-bs-toggle="tooltip" href="" title="Attach a File"><i className="fe fe-paperclip"></i></Link>
                    <Button className="btn btn-icon  btn-primary brround"><i className="fa fa-paper-plane-o"></i></Button>
                    <nav className="nav">
                    </nav>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ) : (
          <Col sm={12} md={12} lg={12} xxl={8}>
            <Card>
              <div className="main-content-app pt-0 text-center">
                <div className="main-content-body main-content-body-chat h-100">
                  <Image alt="start" src="../../../assets/images/start-conversation.png" width={150} className='mx-auto d-block mt-10'  fluid/>
                </div>
              </div>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  )
}

Chat.layout = 'Contentlayout'
export default Chat