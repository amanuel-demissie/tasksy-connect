import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Edit, Trash2, Pencil, UserPlus, Search, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";

interface Employee {
  id: string;
  name: string;
  title: string | null;
  bio: string | null;
  image_url: string | null;
  is_active: boolean;
}

interface User {
  id: string;
  username: string | null;
  email: string | null;
  avatar_url: string | null;
}

interface EmployeesListProps {
  businessId: string;
  onEmployeeAdded: () => void;
}

export default function EmployeesList({ businessId, onEmployeeAdded }: EmployeesListProps) {
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  
  // User search state
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(false);
  
  // Form state for editing employees
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch employees
  React.useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const { data, error } = await supabase
          .from("employees")
          .select("*")
          .eq("business_id", businessId)
          .order("name");

        if (error) throw error;
        setEmployees(data || []);
      } catch (error) {
        console.error("Error fetching employees:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load employees",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [businessId, toast]);

  // Reset form
  const resetForm = () => {
    setName("");
    setTitle("");
    setBio("");
    setImageFile(null);
    setEditEmployee(null);
  };

  // Search users
  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setUsers([]);
      return;
    }

    setLoadingUsers(true);
    try {
      const trimmedQuery = query.trim();
      console.log(trimmedQuery);
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, email, avatar_url")
        .or(
          `username.ilike.%${trimmedQuery}*,email.ilike.%${trimmedQuery}*`
        )
        .limit(10);

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Error searching users:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to search users",
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  // Debounced search effect
  React.useEffect(() => {
    if (!showUserSearch) return;
    if (!searchQuery.trim()) {
      setUsers([]);
      setLoadingUsers(false);
      return;
    }
    setLoadingUsers(true);
    const handler = setTimeout(() => {
      searchUsers(searchQuery);
    }, 1500);
    return () => clearTimeout(handler);
  }, [searchQuery, showUserSearch]);

  // Fetch all users when dialog opens and searchQuery is empty
  React.useEffect(() => {
    if (showUserSearch && !searchQuery.trim()) {
      setLoadingUsers(true);
      supabase
        .from("profiles")
        .select("id, username, email, avatar_url")
        .limit(10)
        .then(({ data, error }) => {
          if (error) {
            setUsers([]);
          } else {
            setUsers(data || []);
          }
          setLoadingUsers(false);
        });
    }
  }, [showUserSearch, searchQuery]);

  // Open user search dialog
  const handleAddEmployee = () => {
    setShowUserSearch(true);
    setSearchQuery("");
    setUsers([]);
    setSelectedUser(null);
  };

  // Add selected user as employee
  const handleAddSelectedUser = async () => {
    if (!selectedUser) return;

    setIsSubmitting(true);
    try {
      const { error, data } = await supabase
        .from("employees")
        .insert({
          business_id: businessId,
          user_id: selectedUser.id,
          name: selectedUser.username || selectedUser.email || "Unknown User",
          is_active: true,
        })
        .select();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Employee added successfully",
      });

      // Add the new employee to the list
      if (data && data.length > 0) {
        setEmployees([...employees, data[0] as Employee]);
      }

      setShowUserSearch(false);
      onEmployeeAdded();
    } catch (error) {
      console.error("Error adding employee:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add employee",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open edit dialog
  const handleEditEmployee = (employee: Employee) => {
    setName(employee.name);
    setTitle(employee.title || "");
    setBio(employee.bio || "");
    setEditEmployee(employee);
    setShowAddDialog(true);
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = editEmployee?.image_url || null;

      // Upload image if provided
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-employee.${fileExt}`;
        const filePath = `employees/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from("profiles")
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("profiles")
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      // Create or update employee
      if (editEmployee) {
        // Update existing employee
        const { error } = await supabase
          .from("employees")
          .update({
            name,
            title,
            bio,
            ...(imageUrl && { image_url: imageUrl }),
          })
          .eq("id", editEmployee.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Employee updated successfully",
        });
      } else {
        // Create new employee
        const { error, data } = await supabase
          .from("employees")
          .insert({
            business_id: businessId,
            name,
            title,
            bio,
            image_url: imageUrl,
            is_active: true,
          })
          .select();

        if (error) throw error;

        toast({
          title: "Success",
          description: "Employee added successfully",
        });

        // Add the new employee to the list
        if (data && data.length > 0) {
          setEmployees([...employees, data[0] as Employee]);
        }
      }

      // Close dialog and refresh
      setShowAddDialog(false);
      onEmployeeAdded();
    } catch (error) {
      console.error("Error saving employee:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save employee",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete employee
  const handleDeleteEmployee = async (employeeId: string) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;

    try {
      const { error } = await supabase
        .from("employees")
        .delete()
        .eq("id", employeeId);

      if (error) throw error;

      // Remove from list
      setEmployees(employees.filter(e => e.id !== employeeId));

      toast({
        title: "Success",
        description: "Employee deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete employee",
      });
    }
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading employees...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Team Members</h3>
        <Button onClick={handleAddEmployee} type="button" size="sm" className="bg-accent text-white hover:bg-accent/90">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </div>

      {employees.length === 0 ? (
        <Card className="border-dashed border-2 bg-muted/50">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No employees added yet.</p>
            <Button 
              onClick={handleAddEmployee} 
              variant="outline" 
              className="mt-4"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Employee
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[300px] pr-4">
          <div className="grid gap-4 md:grid-cols-2">
            {employees.map((employee) => (
              <Card key={employee.id} className="overflow-hidden">
                <div className="flex items-start p-4">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={employee.image_url || undefined} alt={employee.name} />
                    <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-medium">{employee.name}</h4>
                    {employee.title && (
                      <p className="text-sm text-muted-foreground">{employee.title}</p>
                    )}
                  </div>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleEditEmployee(employee)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteEmployee(employee.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {employee.bio && (
                  <CardContent className="pt-0">
                    <p className="text-sm">{employee.bio}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}

      {/* User Search Dialog */}
      <Dialog open={showUserSearch} onOpenChange={setShowUserSearch}>
        <DialogContent className="w-full max-w-sm sm:max-w-md px-4 py-6">
          <DialogHeader>
            <DialogTitle>Search and Add Employee</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4 max-h-[80vh] overflow-y-auto">
            <Command>
              <div className="flex items-center border rounded-md px-3">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <CommandInput
                  placeholder="Search by username or email..."
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                />
              </div>
              <CommandList className="mt-2">
                <CommandEmpty>
                  {loadingUsers ? (
                    <div className="flex items-center justify-center py-4">
                      <svg className="animate-spin h-5 w-5 text-accent mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                      </svg>
                      <span>Searching...</span>
                    </div>
                  ) : users.length === 0 ? "No users found." : null}
                </CommandEmpty>
                <CommandGroup>
                  {users.map((user) => (
                    <CommandItem
                      key={user.id}
                      onSelect={() => setSelectedUser(user)}
                      className={`cursor-pointer ${selectedUser?.id === user.id ? 'bg-accent' : ''}`}
                    >
                      <div className="flex items-center w-full">
                        <Avatar className="h-8 w-8 mr-3">
                          <AvatarImage src={user.avatar_url || undefined} />
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{user.username || "No username"}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>

            {selectedUser && (
              <div className="border rounded-lg p-4 bg-muted/50">
                <h4 className="font-medium mb-2">Selected User:</h4>
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={selectedUser.avatar_url || undefined} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedUser.username || "No username"}</p>
                    <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowUserSearch(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddSelectedUser}
                disabled={!selectedUser || isSubmitting}
                className="bg-accent text-white hover:bg-accent/90"
              >
                {isSubmitting ? 'Adding...' : 'Add Employee'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Employee Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title">Title/Role (optional)</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio (optional)</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">Profile Image (optional)</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="cursor-pointer"
              />
              {(editEmployee?.image_url || imageFile) && (
                <div className="mt-2 flex items-center">
                  <Avatar className="h-10 w-10">
                    <AvatarImage 
                      src={imageFile ? URL.createObjectURL(imageFile) : editEmployee?.image_url || undefined} 
                      alt="Preview" 
                    />
                    <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="ml-2 text-sm text-muted-foreground">
                    {imageFile ? 'New image selected' : 'Current image'}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowAddDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-accent text-white hover:bg-accent/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Update'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
