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
import LeftChat from '../../../components/chat/LeftChat';
import InitialCmd from '../../../components/chat/command/InitialCmd';
import CategoryCmd from '../../../components/chat/command/CategoryCmd';
import HelpCmd from '../../../components/chat/command/HelpCmd';
import ListCmd from '../../../components/chat/command/ListCmd';


const Chat = () => {
  const avatarUrl = process.env.NEXT_PUBLIC_AVATAR_URL;
  const avatarContactUrl = process.env.NEXT_PUBLIC_AVATAR_CONTACT_URL;
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [initialFetchComplete, setInitialFetchComplete] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [toThreadId, setToThreadId] = useState('');
  const [toAssistantId, setToAssistantId] = useState('');
  const [typeChat, setTypeChat] = useState('');
  const [userCredit, setUserCredit] = useState(0);
  const [reciverName, setReciverName] = useState('');
  const [reciverPhoto, setReciverPhoto] = useState('');
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

  // Realtime Credit User
  useEffect(() => {
    if (userData) {      
      const fetchCreditUser = async () => {
        try {
          const response = await axios.get('/api/chat/credit', {
              params: {
              id: userData?.sud
            }
          });
          if (response.status === 201) {
            setUserCredit(response.data);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
  
      fetchCreditUser();
    }
  }, [userData]);

  useEffect(() => {
    if (userData) {
      const channel = supabase
        .channel('realtime users')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'users' }, handleCreditUpdated)
        .subscribe()

      return () => {
        channel.unsubscribe();
      };
    }
  }, [userData]);

  const handleCreditUpdated = (payload) => {
    const { new: updatedCredit } = payload
    if (updatedCredit.id === userData?.sud) {
      setUserCredit(updatedCredit.credit)
    }
  }

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

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    try {
      setIsLoading(true);
      setInputText(''); 
      if (typeChat === 0) {
        const response = await axios.post('/api/chat/sending/bot', { 
          text: inputText, 
          sender: 'user', 
          room_id: selectedRoom,
          sender_name: userData?.sun,
          sender_photo: userData?.photo,
          bot_name: reciverName,
          bot_photo: reciverPhoto
        });
        if (response.status === 200) {
          setSelectedRoom(selectedRoom)
          setInputText('');
          setIsLoading(false);
          toast.success(response.data.message);
        }
      } else if(typeChat === 1) {
        const remainingCredit = userCredit - 5;
        const status = remainingCredit >= 0;
        const finalCredit = status ? remainingCredit : 0;

        const response = await axios.post('/api/chat/sending/ai', { 
          text: inputText, 
          sender: 'user', 
          thread_id: toThreadId, 
          room_id: selectedRoom,
          assistant_id:  toAssistantId,
          status: status,
          credit: finalCredit,
          userId: userData?.sud,
          sender_name: userData?.sun,
          sender_photo: userData?.photo,
          bot_name: reciverName,
          bot_photo: reciverPhoto
        });
        if (response.status === 200) {
          setInputText('');
          setIsLoading(false);
          toast.success(response.data.message);
        } else if (response.status === 201) {
          setInputText('');
          setIsLoading(false);
          setTypeChat(response.data.type_chat);
          toast.warning(response.data.message);
        }
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

  // Mendefinisikan fungsi untuk mengubah format tanggal
  function formatDateTime(dateTimeString) {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    };

    const formattedDate = new Date(dateTimeString).toLocaleDateString('en-GB', options);
    return formattedDate;
  }


  return (
    <div>
      <ToastContainer />
      <Seo title="Chat"/>
      <PageHeader titles="Chat" active="Chat" items={['Apps']} />
      <Row className="row-sm">
        <LeftChat 
          userData={userData} 
          userCredit={userCredit}
          selectedRoom={selectedRoom}
          initialFetchComplete={initialFetchComplete}
          setSelectedRoom={setSelectedRoom}
          setToAssistantId={setToAssistantId}
          setToThreadId={setToThreadId}
          setTypeChat={setTypeChat}
          setInitialFetchComplete={setInitialFetchComplete}
          setReciverName={setReciverName}
          setReciverPhoto={setReciverPhoto}
        />
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
                            <div className="media chat-left mb-2">
                              {msg.sender_photo ? (
                                <div className="main-img-user">
                                  <img alt="avatar" src={avatarContactUrl+msg.sender_photo} />
                                </div>
                              ) : (
                                <div className="avatar avatar-md brround bg-primary-transparent text-primary">{msg?.sender_name.trim().charAt(0)}</div>
                              )}
                              <div className="media-body">
                                <div className="main-msg-wrapper">
                                    <div>
                                      {formatOutput(msg.content)}
                                      {msg.command_show && msg.initial_command === 0 ? (
                                        <InitialCmd 
                                          roomId={selectedRoom} 
                                          setIsTyping={setIsTyping}
                                          userData={userData} 
                                          reciverName={reciverName}
                                          reciverPhoto={reciverPhoto}
                                        />
                                        ) : msg.command_id && msg.command_show && msg.initial_command === 1 ? (
                                        <CategoryCmd 
                                          commandId={msg.command_id} 
                                          roomId={selectedRoom} 
                                          setIsTyping={setIsTyping} 
                                          userData={userData} 
                                          reciverName={reciverName}
                                          reciverPhoto={reciverPhoto}
                                        />
                                        ) : msg.command_show && msg.initial_command === 2 ? (
                                        <HelpCmd 
                                          roomId={selectedRoom} 
                                          setIsTyping={setIsTyping} 
                                          commandId={msg.command_id}
                                          userData={userData} 
                                          reciverName={reciverName}
                                          reciverPhoto={reciverPhoto}
                                        />
                                        ) : (
                                        <></>
                                      )}
                                    </div>
                                </div>
                                <div>
                                  <div>
                                    <p style={{ fontSize: '12px' }}>{msg.sender_name} <p style={{ fontSize: '12px' }}>{formatDateTime(msg.created_at)}</p></p>
                                  </div>
                                  {/* <span>{msg.created_at}</span> <Link href=""><i className="icon ion-android-more-horizontal"></i></Link> */}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="media flex-row-reverse chat-right mb-2">
                              {msg.sender_photo ? (
                                <div className="main-img-user">
                                  <img alt="avatar" src={avatarUrl+msg.sender_photo} />
                                </div>
                              ) : (
                                <div className="avatar avatar-md brround bg-primary-transparent text-primary">{msg?.sender_name.trim().charAt(0)}</div>
                              )}
                              <div className="media-body">
                                <div className="main-msg-wrapper">
                                <div dangerouslySetInnerHTML={{ __html: msg.content }} />
                                </div>
                                <div>
                                  <div>
                                    <span style={{ fontSize: '12px' }} className='media flex-row-reverse'>{msg.sender_name} </span>
                                    <span style={{ fontSize: '12px' }}>{formatDateTime(msg.created_at)}</span>
                                  </div>
                                  {/* <span>{msg.created_at}</span> <Link href=""><i className="icon ion-android-more-horizontal"></i></Link> */}
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
                  <ListCmd 
                    typeChat={typeChat} 
                    credit={userCredit} 
                    roomId={selectedRoom} 
                    userData={userData} 
                    reciverName={reciverName}
                    reciverPhoto={reciverPhoto}
                    setToThreadId={setToThreadId}
                    setToAssistantId={setToAssistantId}
                    setTypeChat={setTypeChat}
                  />
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