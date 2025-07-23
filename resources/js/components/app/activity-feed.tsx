import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  MessageSquare,
  Clock,
  User,
  Edit,
  Trash2,
  Plus,
  Send,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ActivityItem {
  id: string | number;
  type: 'comment' | 'system' | 'edit' | 'status_change' | 'custom';
  title?: string;
  content: string;
  user: {
    name: string;
    avatar?: string;
    initials?: string;
  };
  timestamp: string;
  metadata?: Record<string, any>;
  canEdit?: boolean;
  canDelete?: boolean;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  canAddComment?: boolean;
  onAddComment?: (content: string) => void;
  onEditActivity?: (id: string | number, content: string) => void;
  onDeleteActivity?: (id: string | number) => void;
  isLoading?: boolean;
  className?: string;
  title?: string;
  emptyMessage?: string;
}

export default function ActivityFeed({
  activities,
  canAddComment = false,
  onAddComment,
  onEditActivity,
  onDeleteActivity,
  isLoading = false,
  className,
  title = "Atividades",
  emptyMessage = "Nenhuma atividade encontrada."
}: ActivityFeedProps) {
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddComment = async () => {
    if (!newComment.trim() || !onAddComment) return;

    setIsSubmitting(true);
    try {
      await onAddComment(newComment.trim());
      setNewComment('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditActivity = async (id: string | number) => {
    if (!editContent.trim() || !onEditActivity) return;

    setIsSubmitting(true);
    try {
      await onEditActivity(id, editContent.trim());
      setEditingId(null);
      setEditContent('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (activity: ActivityItem) => {
    setEditingId(activity.id);
    setEditContent(activity.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'comment':
        return <MessageSquare className="h-4 w-4" />;
      case 'edit':
        return <Edit className="h-4 w-4" />;
      case 'system':
        return <Activity className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'comment':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300';
      case 'edit':
        return 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300';
      case 'system':
        return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300';
      case 'status_change':
        return 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          {title}
          <Badge variant="secondary" className="ml-auto">
            {activities.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Comment Form */}
        {canAddComment && onAddComment && (
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <Textarea
              placeholder="Adicionar um comentário..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
              disabled={isSubmitting}
            />
            <div className="flex justify-end">
              <Button
                onClick={handleAddComment}
                disabled={!newComment.trim() || isSubmitting}
                size="sm"
              >
                <Send className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Enviando...' : 'Comentar'}
              </Button>
            </div>
          </div>
        )}

        {/* Activities List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-8 h-8 bg-muted rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/4" />
                  <div className="h-3 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{emptyMessage}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={activity.id} className="relative">
                {index < activities.length - 1 && (
                  <div className="absolute left-4 top-10 bottom-0 w-px bg-border" />
                )}

                <div className="flex gap-3">
                  {/* Avatar */}
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={activity.user.avatar} />
                      <AvatarFallback className="text-xs">
                        {activity.user.initials || activity.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className={cn(
                      "absolute -bottom-1 -right-1 h-4 w-4 rounded-full flex items-center justify-center",
                      getActivityColor(activity.type)
                    )}>
                      {getActivityIcon(activity.type)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{activity.user.name}</span>
                      {activity.title && (
                        <>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">{activity.title}</span>
                        </>
                      )}
                      <span className="text-xs text-muted-foreground ml-auto">
                        {new Date(activity.timestamp).toLocaleString('pt-BR')}
                      </span>
                    </div>

                    {/* Activity Content */}
                    {editingId === activity.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows={3}
                          disabled={isSubmitting}
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleEditActivity(activity.id)}
                            disabled={!editContent.trim() || isSubmitting}
                          >
                            Salvar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={cancelEdit}
                            disabled={isSubmitting}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-sm text-foreground whitespace-pre-wrap">
                          {activity.content}
                        </p>

                        {/* Actions */}
                        {(activity.canEdit || activity.canDelete) && activity.type === 'comment' && (
                          <div className="flex gap-2">
                            {activity.canEdit && onEditActivity && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => startEdit(activity)}
                                className="h-6 px-2 text-xs"
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                Editar
                              </Button>
                            )}
                            {activity.canDelete && onDeleteActivity && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => onDeleteActivity(activity.id)}
                                className="h-6 px-2 text-xs text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Excluir
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
