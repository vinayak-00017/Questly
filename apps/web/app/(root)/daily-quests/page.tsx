"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QuestTemplate } from "@questly/types";
import { questTemplateApi } from "@/services/quest-template-api";
import { questApi } from "@/services/quest-api";
import QuestTemplateCard from "@/components/quest-template/quest-template-card";
import EditQuestTemplateDialog from "@/components/quest-template/edit-quest-template-dialog";
import DailyQuestCard from "@/components/quest-card/daily-quest-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Settings,
  Plus,
  Filter,
  Search,
  Users,
  Target,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { isQuestTemplateExpired } from "@/components/quest-template/quest-template-helpers";

const DailyQuests = () => {
  const queryClient = useQueryClient();
  const [selectedTemplate, setSelectedTemplate] =
    useState<QuestTemplate | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "active" | "inactive">(
    "all"
  );
  const [filterQuestType, setFilterQuestType] = useState<
    "all" | "daily" | "side"
  >("all");

  // Fetch quest templates
  const { data: templatesData, isLoading: isLoadingTemplates } = useQuery({
    queryKey: ["questTemplates"],
    queryFn: questTemplateApi.fetchQuestTemplates,
    select: (data) => data.questTemplates || [],
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: questTemplateApi.deleteQuestTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questTemplates"] });
      toast.success("Quest template deleted successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete quest template");
    },
  });

  // Toggle status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      questTemplateApi.toggleQuestTemplateStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questTemplates"] });
      toast.success("Quest template status updated!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update status");
    },
  });

  // Filter templates
  const filteredTemplates = (templatesData || []).filter((template) => {
    const matchesSearch = template.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterType === "all" ||
      (filterType === "active" && template.isActive) ||
      (filterType === "inactive" && !template.isActive);
    const matchesQuestType =
      filterQuestType === "all" || template.type === filterQuestType;

    return matchesSearch && matchesStatus && matchesQuestType;
  });

  // Calculate stats
  const totalTemplates = templatesData?.length || 0;

  // Active templates exclude expired ones
  const activeTemplates =
    templatesData?.filter((t) => t.isActive && !isQuestTemplateExpired(t))
      .length || 0;

  const dailyTemplates =
    templatesData?.filter((t) => t.type === "daily").length || 0;
  const sideTemplates =
    templatesData?.filter((t) => t.type === "side").length || 0;

  const handleEdit = (template: QuestTemplate) => {
    setSelectedTemplate(template);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleToggleStatus = (id: string, isActive: boolean) => {
    toggleStatusMutation.mutate({ id, isActive });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="relative z-10 flex h-full w-full flex-col px-4 py-6 md:px-8 md:py-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Daily Quest Management
            </h1>
            <p className="text-slate-400 text-lg">
              Manage your quest templates and view active daily quests
            </p>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Target className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Total Templates</p>
                <p className="text-xl font-bold text-white">{totalTemplates}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Active</p>
                <p className="text-xl font-bold text-white">
                  {activeTemplates}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Calendar className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Daily Quests</p>
                <p className="text-xl font-bold text-white">{dailyTemplates}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Users className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Side Quests</p>
                <p className="text-xl font-bold text-white">{sideTemplates}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="flex-1">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border-slate-700/50">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-slate-700"
            >
              Quest Overview
            </TabsTrigger>
            <TabsTrigger
              value="templates"
              className="data-[state=active]:bg-slate-700"
            >
              Template Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <DailyQuestCard />
          </TabsContent>

          <TabsContent value="templates" className="space-y-6 mt-6">
            {/* Filters and Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
            >
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-800/50 border-slate-600 text-white"
                  />
                </div>

                <Select
                  value={filterType}
                  onValueChange={(value: any) => setFilterType(value)}
                >
                  <SelectTrigger className="w-32 bg-slate-800/50 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filterQuestType}
                  onValueChange={(value: any) => setFilterQuestType(value)}
                >
                  <SelectTrigger className="w-32 bg-slate-800/50 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="side">Side</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={() => {
                  /* TODO: Add new template dialog */
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Template
              </Button>
            </motion.div>

            {/* Templates Grid */}
            {isLoadingTemplates ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-48 bg-slate-800/50 border border-slate-700/50 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : filteredTemplates.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredTemplates.map((template, index) => (
                  <QuestTemplateCard
                    key={template.id}
                    questTemplate={template}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleStatus={handleToggleStatus}
                    index={index}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-center py-12"
              >
                <Settings className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No quest templates found
                </h3>
                <p className="text-slate-400 mb-6">
                  {searchTerm ||
                  filterType !== "all" ||
                  filterQuestType !== "all"
                    ? "Try adjusting your filters"
                    : "Create your first quest template to get started"}
                </p>
                <Button
                  onClick={() => {
                    /* TODO: Add new template dialog */
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Dialog */}
      <EditQuestTemplateDialog
        questTemplate={selectedTemplate}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </div>
  );
};

export default DailyQuests;
