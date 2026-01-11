import { queryOptions } from "@tanstack/react-query";
import { AsyncSelect } from "../custom-ui/AsyncSelect";
import { useState } from "react";

interface ListOrgsProps {}

export function ListOrgs({}: ListOrgsProps) {
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const usersQueryOptions = queryOptions({
    queryKey: ["users","list"],
    queryFn: ({ queryKey }) => {
      const searchTerm = queryKey.at(-1) as string | undefined;
      console.log("Fetching users with search term:", searchTerm);
      return new Promise<{ id: string; name: string }[]>((resolve) => {
        setTimeout(() => {
          resolve([
            { id: "1", name: "Alice" },
            { id: "2", name: "Bob" },
            { id: "3", name: "Charlie" },
            { id: "4", name: "Diana" },
            { id: "5", name: "Eve" },
            { id: "6", name: "Frank" },
            { id: "7", name: "Grace" },
            { id: "8", name: "Heidi" },
            { id: "9", name: "Ivan" },
            { id: "10", name: "Judy" },
            { id: "11", name: "Karl" },
            { id: "12", name: "Liam" },
            { id: "13", name: "Mia" },
            { id: "14", name: "Nina" },
            { id: "15", name: "Oscar" },
          ]);
        }, 1000);
      });
    },
  });
  return (
    <AsyncSelect
      queryOptions={usersQueryOptions} // Pass query options directly
      renderOption={(user) => <span>{user.name}</span>}
      getOptionValue={(user) => user.id}
      getDisplayValue={(user) => user.name}
      filterFn={(user, query) => {
        return user.name.toLowerCase().includes(query.toLowerCase());
      }}
      placeholder="Select a user"
      value={selectedUserId}
      onChange={setSelectedUserId}
      label="Users"
    />
  );
}
