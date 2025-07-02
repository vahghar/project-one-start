'use client'
import React, { useState } from 'react'
import { ChevronRight, ChevronDown, Folder, File, FolderOpen } from 'lucide-react'
import { api } from '@/trpc/react'
import useProject from '@/hooks/use-project'
import { Card } from '@/components/ui/card'

type TreeNode = {
  name: string
  type: 'file' | 'folder'
  children?: TreeNode[] | null
}

type TreeItemProps = {
  node: TreeNode
  level: number
}

const TreeItem: React.FC<TreeItemProps> = ({ node, level }) => {
  const [isExpanded, setIsExpanded] = useState(level < 2) // Auto-expand first 2 levels
  
  const hasChildren = node.children && node.children.length > 0
  
  const toggleExpanded = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded)
    }
  }

  return (
    <div>
      <div 
        className={`flex items-center gap-2 py-1 px-2 rounded-md hover:bg-gray-50 transition-colors cursor-pointer ${
          level > 0 ? 'ml-4' : ''
        }`}
        onClick={toggleExpanded}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {hasChildren ? (
          <div className="flex items-center justify-center w-4 h-4">
            {isExpanded ? (
              <ChevronDown className="w-3 h-3 text-gray-500" />
            ) : (
              <ChevronRight className="w-3 h-3 text-gray-500" />
            )}
          </div>
        ) : (
          <div className="w-4 h-4" />
        )}
        
        {node.type === 'folder' ? (
          isExpanded ? (
            <FolderOpen className="w-4 h-4 text-purple-600" />
          ) : (
            <Folder className="w-4 h-4 text-purple-600" />
          )
        ) : (
          <File className="w-4 h-4 text-gray-500" />
        )}
        
        <span className={`text-sm ${
          node.type === 'folder' 
            ? 'text-gray-900 font-medium' 
            : 'text-gray-700'
        }`}>
          {node.name}
        </span>
      </div>
      
      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child, index) => (
            <TreeItem 
              key={`${child.name}-${index}`} 
              node={child} 
              level={level + 1} 
            />
          ))}
        </div>
      )}
    </div>
  )
}

const FileTree = () => {
  const { project } = useProject()
  const { data: fileStructure, isLoading, error } = api.project.getFileStructure.useQuery(
    { projectId: project?.id || '' },
    { enabled: !!project?.id }
  )

  if (!project?.id) {
    return (
      <Card className="p-6 border-gray-200 bg-white shadow-md">
        <div className="text-center text-gray-500">
          <Folder className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p>No project selected</p>
        </div>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="p-6 border-gray-200 bg-white shadow-md">
        <div className="text-center text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-2"></div>
          <p>Loading file structure...</p>
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-6 border-gray-200 bg-white shadow-md">
        <div className="text-center text-gray-500">
          <p>Error loading file structure</p>
        </div>
      </Card>
    )
  }

  if (!fileStructure || fileStructure.length === 0) {
    return (
      <Card className="p-6 border-gray-200 bg-white shadow-md">
        <div className="text-center text-gray-500">
          <Folder className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p>No files found in this project</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="border-gray-200 bg-white shadow-md hover:shadow-md">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Repository Structure
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {fileStructure.length} root items
        </p>
      </div>
      <div className="p-4 max-h-96 overflow-y-auto">
        {fileStructure.map((node, index) => (
          <TreeItem key={`${node.name}-${index}`} node={node} level={0} />
        ))}
      </div>
    </Card>
  )
}

export default FileTree 