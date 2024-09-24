import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  CircularProgress,
  CardBody,
  Card,
} from "@nextui-org/react";
import { IoAdd, IoLockClosed } from "react-icons/io5";
import { useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { DContest_backend_contestant } from "declarations/DContest_backend_contestant";

export default function LockedCard() {
  return (
    <>
      <Card
        // isPressable
        className="w-full flex flex-col items-center bg-opacity-40 bg-black backdrop-blur-md"
        // onPress={() => onOpenChange(true)}
        radius="sm"
      >
        <CardBody className="flex flex-col items-center justify-center">
          <IoLockClosed className="text-6xl text-gray-400 mb-2" />
          <p className="text-gray-400">Not started yet</p>
        </CardBody>
      </Card>
    </>
  );
}
