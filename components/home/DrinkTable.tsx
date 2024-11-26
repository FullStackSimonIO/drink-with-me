import React from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";

type User = {
  name: string;
  currCount: number;
};

type Props = {
  users: User[];
};

const DrinkTable = ({ users }: Props) => {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Aktuell:</TableHead>
            <TableHead>Hinzufügen:</TableHead>
            <TableHead>Entfernen:</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, index) => (
            <TableRow key={index}>
              <TableCell>user.name</TableCell>
              <TableCell>user.currCount</TableCell>
              <TableCell>
                <Button>Bier trinken</Button>
              </TableCell>
              <TableCell>
                <Button>Bier zahlen</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DrinkTable;
