import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
} from "@material-ui/core";
import { Role } from "../types/Role";
import { useRoleQueries } from "../hooks/queries/useRoleQueries";
import { useUserMutations } from "../hooks/mutations/useUserMutations";
import { useUserQueries } from "../hooks/queries/useUserQueries";

// Replace this with your actual roles data
const rolesList = ["Actor", "Director", "Producer", "Writer", "Technician"];

interface AddRolesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  existingRoles: string[];
}

const AddRolesDialog: React.FC<AddRolesDialogProps> = ({
  isOpen,
  onClose,
  existingRoles,
}) => {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);

  const { loading, fetchAvailableRoles } = useRoleQueries();
  const { fetchUserInfo } = useUserQueries();
  const { addRole } = useUserMutations();
  // This effect runs when the component mounts
  useEffect(() => {
    const testRoles = ["Producer", "Actor", "Technician", "Writer"];
    // Fetch available roles if needed, or use existingRoles
    const fetchRoles = async () => {
      const fetchedRoles = await fetchAvailableRoles(); // Fetch all roles
      console.log("FETCHED ROLES", fetchedRoles);
      const filteredRoles = fetchedRoles
        ?.filter(
          (role) =>
            !existingRoles?.some((existingRole) => existingRole === role.role)
        )
        .map((role) => role.role);

      setAvailableRoles(filteredRoles || testRoles);
    };

    fetchRoles();
  }, [existingRoles]); // Only re-run the effect if existingRoles changes

  useEffect(() => {
    // Set selected roles initially based on existing roles
    setSelectedRoles(existingRoles);
  }, [existingRoles]);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedRoles(event.target.value as string[]);
  };

  const handleAddRoles = async () => {
    // Implement the logic to add roles here
    for (let index = 0; index < selectedRoles.length; index++) {
      await addRole(selectedRoles[index]);
    }
    await fetchUserInfo();
    onClose();
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={isOpen} onClose={onClose}>
      <DialogTitle>Add Roles</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <InputLabel>Roles</InputLabel>
          <Select
            multiple
            value={selectedRoles}
            onChange={handleChange}
            renderValue={(selected) => (selected as string[]).join(", ")}
            MenuProps={{
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "left",
              },
              transformOrigin: {
                vertical: "top",
                horizontal: "left",
              },
              getContentAnchorEl: null,
              PaperProps: {
                style: {
                  maxHeight: "400px",
                  maxWidth: "550px",
                },
              },
            }}
          >
            {availableRoles.map((role) => (
              <MenuItem key={role} value={role}>
                <Checkbox checked={selectedRoles.includes(role)} />
                <ListItemText primary={role} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleAddRoles}
          color="secondary"
          endIcon={loading && <CircularProgress size={24} />}
        >
          Add Roles
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddRolesDialog;
