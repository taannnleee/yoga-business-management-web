import {
    Box,
    Button,
    VStack,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    List,
    ListItem,
    ListIcon,
    HStack,
    Text,
    Icon,
    Input,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    SimpleGrid,
    useDisclosure,
  } from "@chakra-ui/react";
  import { AddIcon } from "@chakra-ui/icons";
  import {
    FiFileText,
    FiVideo,
    FiMic,
    FiHelpCircle,
  } from "react-icons/fi";
  import {
    RxTriangleDown,
    RxTriangleUp,
    RxDragHandleDots2,
  } from "react-icons/rx";
  import { RiDeleteBinFill } from "react-icons/ri";
  import { PiPencilSimpleFill } from "react-icons/pi";
  import { useState } from "react";
  
  const Curriculum = () => {
    const [sections, setSections] = useState([
      {
        id: 1,
        title: "Section 1: Lectures",
        lessons: [
          { id: 1, icon: FiFileText, color: "green.500", text: "Part 1 - Your First Ride" },
          { id: 2, icon: FiMic, color: "purple.500", text: "Part 2 - A Closer Introduction" },
          { id: 3, icon: FiHelpCircle, color: "orange.500", text: "Part 3 - Structure Your Training" },
        ],
      },
      {
        id: 2,
        title: "Section 2: Necessary",
        lessons: [
          { id: 1, icon: FiFileText, color: "green.500", text: "Part 4 - Finding New Training" },
          { id: 2, icon: FiVideo, color: "blue.500", text: "Part 5 - Zoom Conference" },
          { id: 3, icon: FiHelpCircle, color: "yellow.500", text: "Final Quiz" },
        ],
      },
    ]);
  
    const [editingSectionId, setEditingSectionId] = useState(null);
    const [showIcons, setShowIcons] = useState(null);
    const [isAddingNewSection, setIsAddingNewSection] = useState(false);
    const [newSectionTitle, setNewSectionTitle] = useState("");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedLessonType, setSelectedLessonType] = useState(null);
  
    const handleDeleteSection = (id) => {
      setSections(sections.filter((section) => section.id !== id));
    };
  
    const handleAddNewSection = () => {
      if (newSectionTitle.trim() !== "") {
        const newSection = {
          id: sections.length + 1,
          title: newSectionTitle,
          lessons: [],
        };
        setSections([...sections, newSection]);
        setNewSectionTitle("");
        setIsAddingNewSection(false);
      }
    };
  
    const handleLessonTypeClick = (lessonType) => {
      setSelectedLessonType(lessonType);
      onClose();
    };
  
    return (
      <HStack spacing={5} align="start" h="full">
        {/* Sidebar Section */}
        <Box w="30%" bg="gray.100" p={5} rounded="md">
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            Curriculum
          </Text>
  
          {/* Accordion for Sections */}
          <Accordion allowMultiple>
            {sections.map((section) => (
              <AccordionItem key={section.id}>
                {({ isExpanded }) => (
                  <>
                    <h2>
                      <AccordionButton
                        _hover={{ bg: "gray.200" }}
                        onMouseEnter={() => setShowIcons(section.id)}
                        onMouseLeave={() => setShowIcons(null)}
                      >
                        <Icon as={RxDragHandleDots2} color="gray.500" marginRight="10px" />
  
                        <Box flex="1" textAlign="left" fontWeight="bold" display="flex" alignItems="center">
                          {editingSectionId === section.id ? (
                            <Input
                              value={section.title}
                              onChange={(e) =>
                                setSections((prevState) =>
                                  prevState.map((s) =>
                                    s.id === section.id ? { ...s, title: e.target.value } : s
                                  )
                                )
                              }
                              onBlur={() => setEditingSectionId(null)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  setEditingSectionId(null);
                                }
                              }}
                              autoFocus
                              size="sm"
                              width="auto"
                            />
                          ) : (
                            section.title
                          )}
  
                          {showIcons === section.id && (
                            <Icon
                              as={PiPencilSimpleFill}
                              color="gray.500"
                              marginLeft="10px"
                              onClick={() => setEditingSectionId(section.id)}
                              cursor="pointer"
                            />
                          )}
                        </Box>
  
                        {showIcons === section.id && (
                          <Box marginRight="10px">
                            <Icon
                              as={RiDeleteBinFill}
                              color="gray.500"
                              cursor="pointer"
                              onClick={() => handleDeleteSection(section.id)}
                            />
                          </Box>
                        )}
  
                        {isExpanded ? <RxTriangleUp /> : <RxTriangleDown />}
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <List spacing={3}>
                        {section.lessons.map((lesson) => (
                          <ListItem key={lesson.id}>
                            <ListIcon as={RxDragHandleDots2} color="gray.500" />
                            <ListIcon as={lesson.icon} color={lesson.color} />
                            {lesson.text}
                          </ListItem>
                        ))}
                      </List>
                      <Button leftIcon={<AddIcon />} colorScheme="blue" mt={4} onClick={onOpen}>
                        Add a lesson
                      </Button>
                    </AccordionPanel>
                  </>
                )}
              </AccordionItem>
            ))}
          </Accordion>
  
          {/* New Section Input */}
          {isAddingNewSection ? (
            <VStack mt={4} spacing={3}>
              <Input
                placeholder="Enter new section title"
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddNewSection();
                  }
                }}
                autoFocus
              />
              <HStack>
                <Button colorScheme="blue" onClick={handleAddNewSection}>
                  Add Section
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingNewSection(false);
                    setNewSectionTitle("");
                  }}
                >
                  Cancel
                </Button>
              </HStack>
            </VStack>
          ) : (
            <Button leftIcon={<AddIcon />} colorScheme="green" mt={4} onClick={() => setIsAddingNewSection(true)}>
              New Section
            </Button>
          )}
        </Box>
  
        {/* Main Content */}
        <Box w="70%" p={10} textAlign="center">
          <Box>
            <Text fontSize="2xl" fontWeight="bold" mb={4}>
              {selectedLessonType ? selectedLessonType : "Let's build your course!"}
            </Text>
            <Text fontSize="md" color="gray.500">
              {selectedLessonType
                ? `You have selected a ${selectedLessonType}.`
                : "Get started by creating the lessons from scratch in the column on the left or import your Educational content."}
            </Text>
          </Box>
        </Box>
  
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent maxW="700px" height="500px" p={5}>
      <ModalHeader fontSize="lg" fontWeight="bold">
        Select lesson type
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Box mb={4}>
          <Text fontWeight="bold" mb={2}>
            Learning Content
          </Text>
          <SimpleGrid columns={4} spacing={4}>
            <Button 
              variant="outline" 
              onClick={() => handleLessonTypeClick("Text lesson")}
              size="lg"
              minW="130px" 
              minH="130px" 
              borderRadius="md" 
              display="flex" 
              flexDirection="column" 
              alignItems="center" 
              justifyContent="center" 
            >
              <Icon as={FiFileText} w={8} h={8} color="blue.500" />
              <Text mt={2} fontSize="sm">
                Text lesson
              </Text>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleLessonTypeClick("Video lesson")}
              size="lg"
              minW="130px"
              minH="130px" 
              borderRadius="md" 
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={FiVideo} w={8} h={8} color="blue.500" />
              <Text mt={2} fontSize="sm">
                Video lesson
              </Text>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleLessonTypeClick("Audio lesson")}
              size="lg"
              minW="130px"
              minH="130px"
              borderRadius="md"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={FiMic} w={8} h={8} color="blue.500" />
              <Text mt={2} fontSize="sm">
                Audio lesson
              </Text>
            </Button>
          </SimpleGrid>
        </Box>
  
        <Box>
          <Text fontWeight="bold" mb={2}>
            Exam Students
          </Text>
          <SimpleGrid columns={4} spacing={4}>
            <Button 
              variant="outline" 
              onClick={() => handleLessonTypeClick("Quiz")}
              size="lg"
              minW="130px"
              minH="130px"
              borderRadius="md"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={FiHelpCircle} w={8} h={8} color="blue.500" />
              <Text mt={2} fontSize="sm">
                Quiz
              </Text>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleLessonTypeClick("Assignment")}
              size="lg"
              minW="130px"
              minH="130px"
              borderRadius="md"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={FiFileText} w={8} h={8} color="blue.500" />
              <Text mt={2} fontSize="sm">
                Assignment
              </Text>
            </Button>
          </SimpleGrid>
        </Box>
      </ModalBody>
    </ModalContent>
  </Modal>
  
  
      </HStack>
    );
  };
  
  export default Curriculum;