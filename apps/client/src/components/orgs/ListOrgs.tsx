import { AsyncSelect } from "../custom-ui/AsyncSelect";
import { useState } from "react";
import { userOrgsQueryOptions } from "@/data-access-layer/users/user-orgs";

interface ListOrgsProps {}

export function ListOrgs({}: ListOrgsProps) {
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const usersQueryOptions = userOrgsQueryOptions({});
  return (
    <AsyncSelect
      queryOptions={usersQueryOptions} // Pass query options directly
      renderOption={(user) => <span>{user.name}</span>}
      getOptionValue={(user) => user.id}
      getDisplayValue={(user) => user.name}
      filterFn={(user, query) => {
        return user.name.toLowerCase().includes(query.toLowerCase());
      }}
      placeholder="Select an organization..."
      value={selectedUserId}
      onChange={setSelectedUserId}
      label="Organizations"
    />
  );
}
