export interface Stakeholder {
  id: string;
  name: string;
  description: string;
  color: string;
  entities: Entity[];
}

export interface Entity {
  id: string;
  stakeholderId: string;
  name: string;
  description: string;
  color: string;
  activities: Activity[];
}

export interface Activity {
  id: string;
  entityId: string;
  name: string;
  description: string;
  startDate: string;
  deadline: string;
  status: 'pending' | 'in-progress' | 'completed';
  deliverables: string[];
  dependencies: string[]; // Activity IDs
  raci: {
    responsible: string[];
    accountable: string[];
    consulted: string[];
    informed: string[];
  };
}

export type RaciRole = 'responsible' | 'accountable' | 'consulted' | 'informed';

export type View = 'stakeholders' | 'activities' | 'process-map';