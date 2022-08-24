import { useState, useEffect, React } from "react";
import { useRecoilState } from "recoil";

import {
  Box,
  Flex,
  Tag,
  TagLabel,
  Avatar,
  Text,
  Badge,
  Button,
  ButtonGroup,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
  AvatarGroup,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { userState, idState, roomState } from "../recoil/atom";

import { socketID, socket } from "../socket";

function SideMenu() {
  const [user, setUser] = useRecoilState(userState);
  const [userId, setUserId] = useRecoilState(idState);
  const [users, setUsers] = useState([]);
  const [room, setRoom] = useRecoilState(roomState);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    socket.on("connection", (data) => {
      console.log("server is connected");
      setRooms(data.rooms);
      setUsers(data.users);
    });

    socket.on("created", (data) => {
      setUserId(data.id);
    });
    socket.on("allUsers", (data) => {
      setUsers(data);
      console.log(data);
    });
    socket.on("createRoom", (data) => {});
    socket.on("allRooms", (data) => {
      setRooms(data);
    });
    socket.on("deleteRoom", (data) => {
      setRooms(data);
    });
  }, []);

  const handleUser = (username) => {
    socket.emit("create", username);
    setUser(username);
  };

  const handleRooms = (room_name) => {
    socket.emit("createRoom", room_name);
    setRoom(room_name);
  };

  const handleDelete = (room_name) => {
    socket.emit("deleteRoom", room_name);
  };

  const handleJoin = (room_name) => {
    socket.emit("joinRoom", room_name);
    setRoom(room_name);
  };

  useEffect(() => {
    setOverlay(<OverlayOne />);
    onOpen(overlay);
  }, []);

  const OverlayOne = () => (
    <ModalOverlay
      bg="blackAlpha.300"
      backdropFilter="blur(10px) hue-rotate(90deg)"
    />
  );
  const OverlayTwo = () => (
    <ModalOverlay
      bg="none"
      backdropFilter="auto"
      backdropInvert="80%"
      backdropBlur="2px"
    />
  );

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [overlay, setOverlay] = useState(<OverlayOne />);
  const [overlayTwo, setOverlayTwo] = useState(<OverlayTwo />);
  console.log(userId);
  return (
    <Flex w="30%" h="70vh" direction="column" p="4">
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        {overlay}
        <ModalContent>
          <ModalHeader>Welcome to the chatroom!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel htmlFor="email">Create a name</FormLabel>
              <Input
                autoComplete="off"
                id="name"
                type="username"
                onChange={(e) => {
                  setUser(e.target.value);
                }}
              />
              <FormHelperText>Your name is your uniqness.</FormHelperText>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => {
                handleUser(user);
                onClose();
              }}
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Box
        bg="rgba( 255, 255, 255, 0.25 )"
        box-shadow="0 8px 32px 0 rgba( 31, 38, 135, 0.37 )"
        backdrop-filter="blur( 4px )"
        border-radius="40px"
        border="1px solid rgba( 255, 255, 255, 0.18 )"
        h="70vh"
        p="4"
      >
        <Text
          fontWeight="bold"
          color="#180B28"
          fontSize="1rem"
          textAlign="left"
          mb="2.5"
        >
          All users
        </Text>
        {users.map((user) => {
          return (
            <Tag
              size="lg"
              colorScheme={user.username == user ? "green" : "gray"}
              borderRadius="full"
              key={user.id}
            >
              <Avatar
                src="https://bit.ly/sage-adebayo"
                size="xs"
                name=""
                ml={-1}
                mr={2}
              />
              <TagLabel>{user.username}</TagLabel>
              <Badge ml="1" colorScheme="green">
                online
              </Badge>
            </Tag>
          );
        })}
        <Text
          fontWeight="bold"
          color="#180B28"
          fontSize="1rem"
          textAlign="left"
          mb="2.5"
        >
          All rooms
        </Text>
        <ButtonGroup
          colorScheme="purple"
          size="sm"
          isAttached
          variant="outline"
          display="flex"
          onClick={() => {
            setOverlayTwo(<OverlayTwo />);
            onOpen();
          }}
        >
          <Button mb="5">Create a new room</Button>
          <IconButton aria-label="Add new chat rooms" icon={<AddIcon />} />
        </ButtonGroup>
        {rooms.map((room) => {
          return (
            <ButtonGroup
              colorScheme="blackAlpha"
              size="sm"
              isAttached
              variant="outline"
              display="flex"
              key={room.id}
            >
              <AvatarGroup size="xs" max={2}>
                <Avatar
                  name="Ryan Florence"
                  src="https://bit.ly/ryan-florence"
                />

                <Avatar
                  name="Christian Nwamba"
                  src="https://bit.ly/code-beast"
                />
              </AvatarGroup>
              <Button
                mb="2.5"
                minW="100px"
                colorScheme={room === room.room_name ? "green" : "blue"}
                ml="4"
                onClick={() => {
                  handleJoin(room.room_name);
                }}
              >
                {room.room_name}
              </Button>
              <IconButton
                aria-label="Add to chat rooms"
                icon={<AddIcon />}
                onClick={() => {
                  handleJoin(room.room_name);
                }}
              />
              <IconButton
                aria-label="Delete chat rooms"
                icon={<DeleteIcon />}
                onClick={() => {
                  handleDelete(room.room_name);
                }}
              />
            </ButtonGroup>
          );
        })}

        <Modal isCentered isOpen={isOpen && userId} onClose={onClose}>
          {overlayTwo}
          <ModalContent>
            <ModalHeader>Create a chat-room name!</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel htmlFor="email">
                  Create a name for the room!
                </FormLabel>
                <Input
                  autoComplete="off"
                  id="name"
                  type="room_name"
                  onChange={(e) => {
                    setRoom(e.target.value);
                  }}
                />
                <FormHelperText>Your name is your uniqness.</FormHelperText>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button
                onClick={() => {
                  handleRooms(room);
                  onClose();
                }}
              >
                Create
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Flex>
  );
}

export default SideMenu;
