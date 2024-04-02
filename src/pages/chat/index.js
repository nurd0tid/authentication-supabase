import PageHeader from '@/shared/layout-components/pageheader/pageHeader'
import Seo from '@/shared/layout-components/seo/seo'
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react'
import { Badge, Button, Card, Col, Dropdown, FormControl, Image, InputGroup, Nav, Row, Tab } from 'react-bootstrap'
import PerfectScrollbar from 'react-perfect-scrollbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import supabase from '../../../supabase';
import Faqs from '../../../components/chat/Faqs';
import ListCommand from '../../../components/chat/ListCommand';
import CommandInChat from '../../../components/chat/CommandInChat';


const Chat = () => {
  const avatarUrl = process.env.NEXT_PUBLIC_AVATAR_URL;
  const [userData, setUserData] = useState(null);
  const [sideMessage, setSideMessage] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState(''); // state for active tab
  const [defaultActiveTab, setDefaultActiveTab] = useState('msg'); // state for default active tab
  const [initialFetchComplete, setInitialFetchComplete] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [toThreadId, setToThreadId] = useState('');
  const [toAssistantId, setToAssistantId] = useState('');
  const messagesEndRef = useRef(null);

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

  // list message room 
  useEffect(() => {
    if (userData) {      
      const fetchSideMessage = async () => {
        try {
          const response = await axios.get('/api/chat/sidemsg', {
              params: {
              id: userData?.sud
            }
          });
          if (response.status === 201) {
            setSideMessage(response.data);
            setInitialFetchComplete(true);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
  
      fetchSideMessage();
    }
  }, [userData]);

  // content message
  useEffect(() => {
    if (selectedRoom) {      
      const fetchContentMessage = async () => {
        try {
          const response = await axios.get('/api/chat/message', {
              params: {
              id: selectedRoom
            }
          });
          if (response.status === 201) {
            setMessages(response.data);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
  
      fetchContentMessage();
    }
  }, [selectedRoom]);

  // realtime message
  useEffect(() => {
    if (initialFetchComplete) {
      const channel = supabase
        .channel('realtime message')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'message' }, handleMessageInserted)
        .subscribe();

      return () => {
        channel.unsubscribe();
      };
    }
  }, [initialFetchComplete, selectedRoom]);

  const handleMessageInserted = (payload) => {
    const { new: newMessage } = payload
    console.log('a', selectedRoom)
    console.log('b', newMessage.thread_room_id)
    if (selectedRoom === newMessage.thread_room_id) {
      setMessages((prevMessage) => [...prevMessage, newMessage])
      scrollToBottom();
    }
  }

  useEffect(() => {
    if (initialFetchComplete) {
      scrollToBottom();
    }
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  };

  // realtime side message room
  useEffect(() => {
    if (initialFetchComplete) {
      const channel = supabase
        .channel('realtime thread')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'thread' }, handleRoomInserted)
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'thread' }, handleRoomUpdated)
        .subscribe()

      return () => {
        channel.unsubscribe();
      };
    }
  }, [initialFetchComplete]);

  const handleRoomInserted = (payload) => {
    const { new: newRoom } = payload
    if (newRoom.room_by || newRoom.reciver === userData.id) {
      setSideMessage((prevRooms) => [...prevRooms, newRoom])
    }
  }

  const handleRoomUpdated = (payload) => {
    const { new: updatedRoom } = payload
    if (updatedRoom && updatedRoom.last_message && updatedRoom.id) {
      setSideMessage((prevRooms) => {
        return prevRooms.map((room) => {
          if (room.id === updatedRoom.id) {
            return {
              ...room,
              last_message: updatedRoom.last_message,
              updated_at: updatedRoom.updated_at
            }
          }
          
          return room

        })
      })
    }
  }

  const handleRoomSelection = (roomId, threadId, assistantsId) => {
    console.log('asoy geboy', roomId)
    setSelectedRoom(roomId);
    setToAssistantId(assistantsId);
    setToThreadId(threadId);
  };

  const clickContact = async (reciverName, assistantId) => {
    try {     
      const response = await axios.post('/api/chat/create', {
        room_by: userData?.sud,
        sender_name: userData?.sun,
        reciver_name: reciverName,
        assistant_id: assistantId
      });
      if (response.status === 201) {
        setSelectedRoom(response.data.room_id); // Set selected room to thread_id
        setActiveTab('msg'); // Set defaultTab to 'msg'
        setToAssistantId(response.data.assistant_id);
        setToThreadId(response.data.thread_id);
        toast.success('Create room successfully')
      }
    } catch (error) {
      toast.error('Something when wrong!')
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    try {
      setIsLoading(true);
      setInputText(''); 
      console.log(toThreadId)
      const response = await axios.post('/api/chat/sendmsg', { 
        text: inputText, 
        sender: 'user', 
        thread_id: toThreadId, 
        room_id: selectedRoom,
        assistant_id:  toAssistantId
      });
      if (response.status === 200) {
        setSelectedRoom(selectedRoom)
        setInputText('');
        setIsLoading(false);
        toast.success(response.data.message);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response.data.message);
    }
  };

  function formatOutput(message) {
    const splitMessage = message.split('\n');
    const fileDescriptions = splitMessage.slice(0, -2);
    const footer = splitMessage.slice(-2).join('\n');

    const linkRegex = /(?:\[([^\]]+)\]\((https?:\/\/[^\)]+)\))|(\((https?:\/\/[^\)]+)\))/g;  // Regex untuk mencocokkan tautan dalam format [teks](URL) / () hanya jika ada http atau https

    // Fungsi untuk mengganti tautan dalam pesan
    const renderMessage = (text) => {
       // Mengganti tautan dengan format <a href="URL" target="_blank" rel="noopener noreferrer">teks</a>
      text = text.replace(linkRegex, (match, text1, url1, text2, url2) => {
        if (url1 && text1) {
          return `<a href="${url1}" target="_blank" rel="noopener noreferrer">${text1}</a>`;
        } else if (url2) {
          return `<a href="${url2}" target="_blank" rel="noopener noreferrer">${url2}</a>`;
        }
      });

      // Membuat teks yang diapit oleh ** menjadi tebal
      text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

      return text;
      };

    return (
      <div>
        <ul>
          {fileDescriptions.map((fileDescription, index) => (
            <li key={index} dangerouslySetInnerHTML={{ __html: renderMessage(fileDescription) }} />
          ))}
        </ul>
        <p dangerouslySetInnerHTML={{ __html: renderMessage(footer) }} />
      </div>
    );
  }

  return (
    <div>
      <ToastContainer />
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
                    </div>
                  </Card.Body>

                  <Card.Body>
                    <InputGroup>
                      <FormControl type="text" placeholder="Search ..." />
                      <Button variant="primary" className="input-group-text">Search</Button>
                    </InputGroup>
                  </Card.Body>

                  <Tab.Container id="left-tabs-example" activeKey={activeTab || defaultActiveTab} onSelect={(key) => setActiveTab(key)}>
                    <Nav variant="pills" className="px-4" >
                      <Nav.Item>
                        <Nav.Link eventKey="msg">Messages</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="cnts">Contacts</Nav.Link>
                      </Nav.Item>
                    </Nav>
                    <Tab.Content className=' main-chat-list flex-2 mt-2'>
                      <Tab.Pane eventKey="msg">
                        <div className="main-chat-list tab-pane">
                          {sideMessage && sideMessage.length > 0 ? (
                            sideMessage.map((sidemsg, index) => (
                              <Link  className={`media ${sidemsg.id === selectedRoom ? 'selected' : ''}`} href="#!" key={index} onClick={() => handleRoomSelection(sidemsg.id, sidemsg.thread_id, sidemsg.assitants_id)}
>
                                <div className="main-img-user online"><img alt="user9" src={sidemsg.reciver_photo ? avatarUrl+sidemsg.reciver_photo : "../../../assets/images/legalnowy.png"} /></div>
                                <div className="media-body">
                                  <div className="media-contact-name">
                                    <span>{sidemsg.reciver_name}</span> <span>{sidemsg.updated_at}</span>
                                  </div>
                                  <p dangerouslySetInnerHTML={{ __html: sidemsg.last_message }} className='text-truncate' style={{ maxHeight: '40px'}}/>
                                </div>
                              </Link>
                            ))
                          ) : (
                            <p className='text-center text-muted'>No message available.</p>
                          )}
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="cnts">
                        <div>
                          <div className="py-4 px-6 fw-bold">A</div>
                          <div className="d-flex align-items-center media" onClick={() => clickContact('Legalnowy', process.env.NEXT_PUBLIC_ASSISTANT_ID)}>
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
                    <div className="main-img-user online"><img alt="avatar" src={"../../../assets/images/legalnowy.png"} /></div>
                    <div className="main-chat-msg-name mt-2">
                      <h6>Legalnowy</h6>
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
                    <PerfectScrollbar containerRef={ref => { messagesEndRef.current = ref; }}>
                      <div className="content-inner">
                        {messages.map((msg, index) => (
                          <div key={index}>
                          {msg.role ===  'system' || msg.role === 'assistant' ? (
                            <div className="media chat-left">
                              <div className="main-img-user online"><img alt="avatar" src={"../../../assets/images/legalnowy.png"} /></div>
                              <div className="media-body">
                                <div className="main-msg-wrapper">
                                    <div>
                                      {formatOutput(msg.content)}
                                      {msg.command_id && msg.command_show && msg.initial_command === 1 ? (
                                          <Faqs commandId={msg.command_id} roomId={selectedRoom} setIsTyping={setIsTyping}/>
                                        ) : msg.command_show && msg.initial_command === 0 && (
                                          <CommandInChat roomId={selectedRoom} setIsTyping={setIsTyping}/>
                                      )}
                                    </div>
                                </div>
                                <div>
                                  <span>{msg.created_at}</span> <Link href=""><i className="icon ion-android-more-horizontal"></i></Link>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="media flex-row-reverse chat-right mb-2">
                              <div className="main-img-user online"><img alt="avatar" src={userData?.photo ? avatarUrl+userData?.photo : "../../../assets/images/users/21.jpg"} /></div>
                              <div className="media-body">
                                <div className="main-msg-wrapper">
                                <div dangerouslySetInnerHTML={{ __html: msg.content }} />
                                </div>
                                <div>
                                  <span>{msg.created_at}</span> <Link href=""><i className="icon ion-android-more-horizontal"></i></Link>
                                </div>
                              </div>
                            </div>
                          )}
                          </div>
                        ))}
                        {isTyping && (
                          <div>
                            <div className="media chat-left mt-2">
                              <div className="main-img-user online"><img alt="avatar" src={"../../../assets/images/legalnowy.png"} /></div>
                              <div className="media-body">
                                <div className="main-msg-wrapper">
                                  <div>
                                    <span className="spinner-grow text-success me-2" style={{ width: '10px', height: '10px' }} ></span>
                                    <span className="spinner-grow text-success me-2 text-danger" style={{ width: '10px', height: '10px' }} ></span>
                                    <span className="spinner-grow text-success me-2 text-warning" style={{ width: '10px', height: '10px' }} ></span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </PerfectScrollbar>
                  </div>
                  <ListCommand/>
                  <div className="main-chat-footer">
                    <input className="form-control" placeholder="Type your message here..." type="text"  value={inputText} onChange={(e) => setInputText(e.target.value)} />
                    <Link className="nav-link" data-bs-toggle="tooltip" href="" title="Attach a File"><i className="fe fe-paperclip"></i></Link>
                    {isLoading ? (
                      <div>
                        <span className="spinner-grow text-success me-2" style={{ width: '10px', height: '10px' }} ></span>
                        <span className="spinner-grow text-success me-2 text-danger" style={{ width: '10px', height: '10px' }} ></span>
                        <span className="spinner-grow text-success me-2 text-warning" style={{ width: '10px', height: '10px' }} ></span>
                      </div>
                    ) : ( 
                      <>
                        <Button className="btn btn-icon  btn-primary brround"  onClick={handleSendMessage}><i className="fa fa-paper-plane-o"></i></Button>
                        <nav className="nav">
                        </nav>
                      </>
                    )}
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