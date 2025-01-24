import { useMemo } from 'react';
import Tree from 'react-d3-tree';
import { User } from '@/types/models';

interface MemberNode {
  name: string;
  attributes?: {
    level?: string;
    earnings?: string;
    joinDate?: string;
  };
  children?: MemberNode[];
}

interface MemberTreeProps {
  data: User[];
  className?: string;
}

export function MemberTree({ data, className }: MemberTreeProps) {
  const treeData = useMemo(() => {
    const buildTree = (users: User[], parentId: number | null = null): MemberNode[] => {
      return users
        .filter(user => user.referral === parentId)
        .map(user => ({
          name: user.username,
          attributes: {
            level: parentId ? `Level ${getLevel(users, user.id)}` : 'Root',
            earnings: `$${user.balance.toLocaleString()}`,
            joinDate: new Date(user.created_at).toLocaleDateString(),
          },
          children: buildTree(users, user.id),
        }));
    };

    const getLevel = (users: User[], userId: number): number => {
      let level = 1;
      let currentUser = users.find(u => u.id === userId);
      while (currentUser?.referral) {
        level++;
        currentUser = users.find(u => u.id === currentUser?.referral);
      }
      return level;
    };

    const rootUsers = data.filter(user => !user.referral);
    return rootUsers.map(user => ({
      name: user.username,
      attributes: {
        level: 'Root',
        earnings: `$${user.balance.toLocaleString()}`,
        joinDate: new Date(user.created_at).toLocaleDateString(),
      },
      children: buildTree(data, user.id),
    }));
  }, [data]);

  const renderForeignObjectNode = ({
    nodeDatum,
    foreignObjectProps,
  }: {
    nodeDatum: MemberNode;
    foreignObjectProps: { width: number; height: number; x: number; y: number };
  }) => (
    <g>
      <circle r={20} fill="#2563eb" />
      <foreignObject {...foreignObjectProps}>
        <div className="flex flex-col p-2 bg-white rounded-lg shadow-sm border">
          <h3 className="font-medium text-sm">{nodeDatum.name}</h3>
          {nodeDatum.attributes && (
            <div className="text-xs text-muted-foreground">
              <p>{nodeDatum.attributes.level}</p>
              <p>{nodeDatum.attributes.earnings}</p>
              <p>Joined: {nodeDatum.attributes.joinDate}</p>
            </div>
          )}
        </div>
      </foreignObject>
    </g>
  );

  const nodeSize = { x: 200, y: 100 };
  const foreignObjectProps = {
    width: nodeSize.x,
    height: nodeSize.y,
    x: -100,
    y: -50,
  };

  return (
    <div className={className} style={{ width: '100%', height: '500px' }}>
      <Tree
        data={treeData}
        nodeSize={nodeSize}
        renderCustomNodeElement={(rd) =>
          renderForeignObjectNode({ ...rd, foreignObjectProps })
        }
        orientation="vertical"
        pathClassFunc={() => 'stroke-primary stroke-2'}
        translate={{ x: 500, y: 50 }}
        separation={{ siblings: 2, nonSiblings: 2.5 }}
      />
    </div>
  );
} 