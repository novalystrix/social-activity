'use client';

import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts';

interface ChartPoint {
  week: string;
  newFollowers: number;
  reach: number;
  reachPotential: number;
  originalPosts: number;
  replyPosts: number;
  engagementRate: number;
}

interface Props {
  data: ChartPoint[];
}

const CHART_STYLE = {
  backgroundColor: 'transparent',
  fontSize: 11,
};

const GRID_COLOR = '#27272a';
const AXIS_COLOR = '#52525b';
const TOOLTIP_STYLE = {
  backgroundColor: '#1a1a2e',
  border: '1px solid #27272a',
  borderRadius: '8px',
  color: '#e4e4e7',
};

export default function AnalyticsCharts({ data }: Props) {
  return (
    <div className="space-y-8">
      {/* New Followers per Week */}
      <ChartCard title="New Followers per Week">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
            <XAxis dataKey="week" stroke={AXIS_COLOR} tick={{ fill: AXIS_COLOR, fontSize: 11 }} />
            <YAxis stroke={AXIS_COLOR} tick={{ fill: AXIS_COLOR, fontSize: 11 }} />
            <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(79,195,247,0.05)' }} />
            <Bar dataKey="newFollowers" name="New Followers" fill="#4FC3F7" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Reach per Week */}
      <ChartCard title="Reach per Week (Impressions)">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
            <XAxis dataKey="week" stroke={AXIS_COLOR} tick={{ fill: AXIS_COLOR, fontSize: 11 }} />
            <YAxis stroke={AXIS_COLOR} tick={{ fill: AXIS_COLOR, fontSize: 11 }} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Line type="monotone" dataKey="reach" name="Impressions" stroke="#4FC3F7" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* New Reach Potential per Week */}
      <ChartCard title="New Reach Potential per Week (Follower Counts of New Followers)">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
            <XAxis dataKey="week" stroke={AXIS_COLOR} tick={{ fill: AXIS_COLOR, fontSize: 11 }} />
            <YAxis stroke={AXIS_COLOR} tick={{ fill: AXIS_COLOR, fontSize: 11 }} />
            <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(167,139,250,0.05)' }} />
            <Bar dataKey="reachPotential" name="Reach Potential" fill="#a78bfa" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Posts per Week */}
      <ChartCard title="Posts per Week">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
            <XAxis dataKey="week" stroke={AXIS_COLOR} tick={{ fill: AXIS_COLOR, fontSize: 11 }} />
            <YAxis stroke={AXIS_COLOR} tick={{ fill: AXIS_COLOR, fontSize: 11 }} />
            <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(79,195,247,0.05)' }} />
            <Legend wrapperStyle={{ color: '#a1a1aa', fontSize: 12 }} />
            <Bar dataKey="originalPosts" name="Original" fill="#4FC3F7" stackId="posts" radius={[0, 0, 0, 0]} />
            <Bar dataKey="replyPosts" name="Replies" fill="#38bdf8" stackId="posts" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Engagement Rate */}
      <ChartCard title="Engagement Rate (Avg interactions per post)">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
            <XAxis dataKey="week" stroke={AXIS_COLOR} tick={{ fill: AXIS_COLOR, fontSize: 11 }} />
            <YAxis stroke={AXIS_COLOR} tick={{ fill: AXIS_COLOR, fontSize: 11 }} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Line type="monotone" dataKey="engagementRate" name="Eng. Rate" stroke="#34d399" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-5 rounded-xl border border-zinc-800 bg-[#1a1a2e]">
      <h2 className="text-sm font-medium text-zinc-400 mb-4">{title}</h2>
      {children}
    </div>
  );
}
