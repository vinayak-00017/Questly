"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QuestTemplate, QuestPriority } from "@questly/types";
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
import SideQuestCard from "@/components/quest-card/side-quest-card";
import { AddDailyQuestDialog } from "@/components/quest-dialog/add-daily-quest-dialog";
import { AddSideQuestDialog } from "@/components/quest-dialog/add-side-quest-dialog";
import { QuestTypeChooserDialog } from "@/components/quest-card/quest-type-chooser-dialog";

const QuestManager = () => {
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
  const [filterImportance, setFilterImportance] = useState<
    "all" | "critical" | "important" | "standard" | "minor" | "optional"
  >("all");

  const [isTypeChooserOpen, setIsTypeChooserOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedQuestType, setSelectedQuestType] = useState<
    "daily" | "side" | null
  >(null);

  // Helper function to get quest priority from basePoints
  const getQuestPriority = (basePoints: number | string): QuestPriority => {
    if (typeof basePoints === "string") {
      return basePoints as QuestPriority;
    }
    // Map number values to priority levels based on points-map.ts
    if (basePoints === 1) return QuestPriority.Optional;
    if (basePoints === 2) return QuestPriority.Minor;
    if (basePoints === 3) return QuestPriority.Standard;
    if (basePoints === 5) return QuestPriority.Important;
    if (basePoints >= 8) return QuestPriority.Critical;
    return QuestPriority.Standard; // default
  };

  // Helper function to get priority order for sorting
  const getPriorityOrder = (priority: QuestPriority): number => {
    switch (priority) {
      case QuestPriority.Critical:
        return 5;
      case QuestPriority.Important:
        return 4;
      case QuestPriority.Standard:
        return 3;
      case QuestPriority.Minor:
        return 2;
      case QuestPriority.Optional:
        return 1;
      default:
        return 3;
    }
  };

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

  // Filter and sort templates
  const filteredTemplates = (templatesData || [])
    .filter((template) => {
      const matchesSearch = template.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterType === "all" ||
        (filterType === "active" && template.isActive) ||
        (filterType === "inactive" && !template.isActive);
      const matchesQuestType =
        filterQuestType === "all" || template.type === filterQuestType;

      const templatePriority = getQuestPriority(template.basePoints);
      const matchesImportance =
        filterImportance === "all" || templatePriority === filterImportance;

      return (
        matchesSearch && matchesStatus && matchesQuestType && matchesImportance
      );
    })
    .sort((a, b) => {
      const priorityA = getPriorityOrder(getQuestPriority(a.basePoints));
      const priorityB = getPriorityOrder(getQuestPriority(b.basePoints));
      // Sort by priority (highest first), then by title
      if (priorityA !== priorityB) {
        return priorityB - priorityA;
      }
      return a.title.localeCompare(b.title);
    });

  // Calculate stats
  const totalTemplates = templatesData?.length || 0;
  const activeTemplates = templatesData?.filter((t) => t.isActive).length || 0;
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

  const handleAddQuest = () => {
    setIsTypeChooserOpen(true);
  };

  const handleQuestTypeSelect = (questType: "daily" | "side") => {
    setIsTypeChooserOpen(false);
    setSelectedQuestType(questType);
    setIsDialogOpen(true);
  };

  // Choose the appropriate dialog based on quest type
  const CurrentAddDialog =
    selectedQuestType === "daily" ? AddDailyQuestDialog : AddSideQuestDialog;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-stone-950 to-slate-950">
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
                Quest Management
              </h1>
              <p className="text-slate-400 text-lg">
                Manage your quest templates and view active quests
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
                  <p className="text-xl font-bold text-white">
                    {totalTemplates}
                  </p>
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
                  <p className="text-xl font-bold text-white">
                    {dailyTemplates}
                  </p>
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
                  <p className="text-xl font-bold text-white">
                    {sideTemplates}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <Tabs defaultValue="templates" className="flex-1">
            <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border-slate-700/50">
              <TabsTrigger
                value="templates"
                className="data-[state=active]:bg-slate-700"
              >
                Template Management
              </TabsTrigger>
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-slate-700"
              >
                Quest Overview
              </TabsTrigger>
            </TabsList>

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

                  <Select
                    value={filterImportance}
                    onValueChange={(value: any) => setFilterImportance(value)}
                  >
                    <SelectTrigger className="w-32 bg-slate-800/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Importance</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="important">Important</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="minor">Minor</SelectItem>
                      <SelectItem value="optional">Optional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleAddQuest}
                  className="bg-stone-300 hover:bg-stone-500"
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
                    className="bg-stone-700 hover:bg-stone-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Template
                  </Button>
                </motion.div>
              )}
            </TabsContent>
            <TabsContent value="overview" className="space-y-6 mt-6">
              <div className=" gap-6">
                <DailyQuestCard />
                <SideQuestCard />
              </div>
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
      <QuestTypeChooserDialog
        open={isTypeChooserOpen}
        onOpenChange={setIsTypeChooserOpen}
        onChoose={handleQuestTypeSelect}
      />

      {isDialogOpen && selectedQuestType && (
        <CurrentAddDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSuccess={() => {
            setSelectedQuestType(null);
          }}
        />
      )}
    </>
  );
};

export default QuestManager;
