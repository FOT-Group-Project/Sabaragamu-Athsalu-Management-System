import { React, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Avatar,
  Button,
  Breadcrumb,
  Modal,
  Checkbox,
  Label,
  TextInput,
} from "flowbite-react";
import { FaUserEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { HiHome } from "react-icons/hi";

export default function DashUsers() {
  const [openModal, setOpenModal] = useState(false);
  return (
    <div className="p-3 w-full">
      <Breadcrumb aria-label="Default breadcrumb example">
        <Breadcrumb.Item href="#" icon={HiHome}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item>Users</Breadcrumb.Item>
      </Breadcrumb>

      <h1 className="mt-3 mb-3 text-left font-semibold text-xl">All Users</h1>

      <Button
        className="mb-3"
        color="blue"
        size="sm"
        onClick={() => setOpenModal(true)}
      >
        Add User
      </Button>

      <Modal className="" show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Create New User</Modal.Header>
        <Modal.Body>
          <div className="space-y-6 ">
            <form className="flex flex-col gap-4">
              <div className="flex gap-2">
                <div>
                  <div className="mb-2 block">
                    <Label value="User name" />
                  </div>
                  <TextInput
                    id="username"
                    type="text"
                    placeholder="@username"
                    required
                    shadow
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label value="First name" />
                  </div>
                  <TextInput
                    id="firstname"
                    type="text"
                    placeholder="First name"
                    required
                    shadow
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label value="Last Name" />
                  </div>
                  <TextInput
                    id="lastname"
                    type="text"
                    placeholder="Last name"
                    required
                    shadow
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="email2" value="Phone number" />
                  </div>
                  <TextInput
                    id="phonenumber"
                    type="text"
                    placeholder="+94 xx xxx xxxx"
                    required
                    shadow
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="email2" value="Email address" />
                  </div>
                  <TextInput
                    id="email"
                    type="email"
                    placeholder="name@gmail.com"
                    required
                    shadow
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="email2" value="Role" />
                  </div>
                  <TextInput
                    id="email2"
                    type="email"
                    placeholder="name@flowbite.com"
                    required
                    shadow
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="email2" value="Password" />
                  </div>
                  <TextInput
                    id="password"
                    type="password"
                    placeholder="**********"
                    required
                    shadow
                  />
                </div>
                <div>
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="email2" value="Confirm password" />
                    </div>
                    <TextInput
                      id="password"
                      type="password"
                      placeholder="**********"
                      required
                      shadow
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="blue" size="sm" onClick={() => setOpenModal(true)}>
            Add User
          </Button>
          <Button size="sm" color="gray" onClick={() => setOpenModal(false)}>
            Decline
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="overflow-x-auto">
        <Table hoverable className="shadow-md w-full">
          <TableHead>
            <TableHeadCell>name</TableHeadCell>
            <TableHeadCell>position</TableHeadCell>
            <TableHeadCell>location</TableHeadCell>
            <TableHeadCell>email</TableHeadCell>
            <TableHeadCell>phone number</TableHeadCell>
            <TableHeadCell>
              <span className="sr-only">Edit</span>
            </TableHeadCell>
          </TableHead>
          <TableBody className="divide-y">
            <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white flex items-center">
                <Avatar
                  alt="user"
                  img="https://avatars.githubusercontent.com/u/91375598?v=4"
                  rounded
                  className="mr-3"
                />

                {"Maleesha Herath"}
              </TableCell>
              <TableCell>Admin</TableCell>
              <TableCell>Rathnapura</TableCell>
              <TableCell>malisha27t@gmail.com</TableCell>
              <TableCell>077-148 9635</TableCell>
              <TableCell>
                <Button.Group>
                  <Button color="gray">
                    <FaUserEdit className="mr-3 h-4 w-4" />
                    Edit
                  </Button>
                  <Button color="gray">
                    <MdDeleteForever className="mr-3 h-4 w-4" />
                    Delete
                  </Button>
                </Button.Group>
              </TableCell>
            </TableRow>
            <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white flex items-center">
                <Avatar
                  alt="user"
                  img="https://avatars.githubusercontent.com/u/91375598?v=4"
                  rounded
                  className="mr-3"
                />

                {"Maleesha Herath"}
              </TableCell>
              <TableCell>Admin</TableCell>
              <TableCell>Rathnapura</TableCell>
              <TableCell>malisha27t@gmail.com</TableCell>
              <TableCell>077-148 9635</TableCell>
              <TableCell>
                <Button.Group>
                  <Button color="gray">
                    <FaUserEdit className="mr-3 h-4 w-4" />
                    Edit
                  </Button>
                  <Button color="gray">
                    <MdDeleteForever className="mr-3 h-4 w-4" />
                    Delete
                  </Button>
                </Button.Group>
              </TableCell>
            </TableRow>
            <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white flex items-center">
                <Avatar
                  alt="user"
                  img="https://avatars.githubusercontent.com/u/91375598?v=4"
                  rounded
                  className="mr-3"
                />

                {"Maleesha Herath"}
              </TableCell>
              <TableCell>Admin</TableCell>
              <TableCell>Rathnapura</TableCell>
              <TableCell>malisha27t@gmail.com</TableCell>
              <TableCell>077-148 9635</TableCell>
              <TableCell>
                <Button.Group>
                  <Button color="gray">
                    <FaUserEdit className="mr-3 h-4 w-4" />
                    Edit
                  </Button>
                  <Button color="gray">
                    <MdDeleteForever className="mr-3 h-4 w-4" />
                    Delete
                  </Button>
                </Button.Group>
              </TableCell>
            </TableRow>
            <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white flex items-center">
                <Avatar
                  alt="user"
                  img="https://avatars.githubusercontent.com/u/91375598?v=4"
                  rounded
                  className="mr-3"
                />

                {"Maleesha Herath"}
              </TableCell>
              <TableCell>Admin</TableCell>
              <TableCell>Rathnapura</TableCell>
              <TableCell>malisha27t@gmail.com</TableCell>
              <TableCell>077-148 9635</TableCell>
              <TableCell>
                <Button.Group>
                  <Button color="gray">
                    <FaUserEdit className="mr-3 h-4 w-4" />
                    Edit
                  </Button>
                  <Button color="gray">
                    <MdDeleteForever className="mr-3 h-4 w-4" />
                    Delete
                  </Button>
                </Button.Group>
              </TableCell>
            </TableRow>
            <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white flex items-center">
                <Avatar
                  alt="user"
                  img="https://avatars.githubusercontent.com/u/91375598?v=4"
                  rounded
                  className="mr-3"
                />

                {"Maleesha Herath"}
              </TableCell>
              <TableCell>Admin</TableCell>
              <TableCell>Rathnapura</TableCell>
              <TableCell>malisha27t@gmail.com</TableCell>
              <TableCell>077-148 9635</TableCell>
              <TableCell>
                <Button.Group>
                  <Button color="gray">
                    <FaUserEdit className="mr-3 h-4 w-4" />
                    Edit
                  </Button>
                  <Button color="gray">
                    <MdDeleteForever className="mr-3 h-4 w-4" />
                    Delete
                  </Button>
                </Button.Group>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
