import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Anchor, 
  ChevronDown, 
  ChevronUp, 
  Ship, 
  Clock, 
  AlertTriangle, 
  Bell, 
  EyeOff,
  ChevronRight,
  Info,
  LayoutGrid,
  PieChart as PieChartIcon
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  Legend
} from 'recharts';

interface ShipTypeStat {
  type: string;
  count: number;
}

interface ShipDetail {
  mmsi: string;
  callSign: string;
  flag: string;
  shipType: string;
  length: number;
  width: number;
  maxDraft: number;
  navStatus: string;
  destination: string;
  lastPort: string;
  purpose: string;
  cargo: string;
  arrivalTime: string;
  agent: string;
}

interface ExpiringShip {
  id: string;
  nameCn: string;
  nameEn: string;
  expiryTime: string;
  remainingTime: string;
  details: ShipDetail;
}

interface OvertimeShip {
  id: string;
  nameCn: string;
  nameEn: string;
  overtimeDuration: string;
  details: ShipDetail;
}

const SHIP_TYPES: ShipTypeStat[] = [
  { type: '渔船', count: 4 },
  { type: '从事疏浚或水下作业的船舶', count: 5 },
  { type: '潜水工作船', count: 5 },
  { type: '军用船舶', count: 5 },
  { type: '游乐船', count: 5 },
  { type: '已预留', count: 5 },
  { type: '救助船', count: 4 },
  { type: '拖船', count: 5 },
  { type: '客船', count: 4 },
  { type: '货船', count: 3 },
  { type: '油船', count: 5 },
  { type: '其他', count: 4 },
];

const CHART_COLORS = [
  '#4DABFF', '#4DFF88', '#FF9F43', '#FF4D4D', 
  '#A855F7', '#EC4899', '#06B6D4', '#8B5CF6',
  '#F59E0B', '#10B981', '#3B82F6', '#6366F1'
];

const MOCK_DETAILS: ShipDetail = {
  mmsi: '413123456',
  callSign: 'BXYZ',
  flag: '中国',
  shipType: '散货船',
  length: 225,
  width: 32,
  maxDraft: 12.8,
  navStatus: '锚泊',
  destination: '宁波舟山港',
  lastPort: '新加坡',
  purpose: '待泊卸货',
  cargo: '铁矿石 (150,000t)',
  arrivalTime: '2026-04-12 08:30',
  agent: '中远海运代理',
};

const EXPIRING_SHIPS: ExpiringShip[] = [
  { 
    id: '1', 
    nameCn: '远洋 123', 
    nameEn: 'Ocean Pioneer 123', 
    expiryTime: '2026-04-15 18:00', 
    remainingTime: '剩余 3小时55分钟',
    details: { ...MOCK_DETAILS, mmsi: '413000001' }
  },
  { 
    id: '2', 
    nameCn: '海丰 77', 
    nameEn: 'Hai Feng 77', 
    expiryTime: '2026-04-15 21:30', 
    remainingTime: '剩余 7小时25分钟',
    details: { ...MOCK_DETAILS, mmsi: '413000002', cargo: '集装箱 (2200 TEU)', purpose: '补给' }
  },
  { 
    id: '3', 
    nameCn: '振华 15', 
    nameEn: 'Zhen Hua 15', 
    expiryTime: '2026-04-16 09:00', 
    remainingTime: '剩余 18小时55分钟',
    details: { ...MOCK_DETAILS, mmsi: '413000003', cargo: '重型机械', length: 280, width: 45 }
  },
];

const OVERTIME_SHIPS: OvertimeShip[] = [
  { 
    id: '4', 
    nameCn: '华东 18', 
    nameEn: 'Hua Dong 18', 
    overtimeDuration: '超时 2H15M',
    details: { ...MOCK_DETAILS, mmsi: '413000004', purpose: '避风', cargo: '空载' }
  },
  { 
    id: '5', 
    nameCn: '中海 203', 
    nameEn: 'COSCO 203', 
    overtimeDuration: '超时 1H05M',
    details: { ...MOCK_DETAILS, mmsi: '413000005', cargo: '原油 (80,000t)', maxDraft: 15.5 }
  },
];

export default function AnchorageSituation() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedShipId, setExpandedShipId] = useState<string | null>(null);
  const [statView, setStatView] = useState<'grid' | 'chart'>('grid');
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const toggleShipExpand = (id: string) => {
    setExpandedShipId(expandedShipId === id ? null : id);
  };

  const ShipDetailContent = ({ details }: { details: ShipDetail }) => (
    <motion.div 
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="mt-3 pt-3 border-t border-white/5 grid grid-cols-2 gap-y-3 gap-x-4"
    >
      <div className="space-y-1">
        <div className="text-[10px] text-gray-500 uppercase tracking-wider">MMSI / 呼号</div>
        <div className="text-xs font-mono">{details.mmsi} / {details.callSign}</div>
      </div>
      <div className="space-y-1">
        <div className="text-[10px] text-gray-500 uppercase tracking-wider">船舶类型 / 状态</div>
        <div className="text-xs flex items-center gap-2">
          <span>{details.shipType}</span>
          <span className="px-1 py-0.5 bg-green-500/10 text-green-400 rounded text-[9px]">{details.navStatus}</span>
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-[10px] text-gray-500 uppercase tracking-wider">船籍 / 代理</div>
        <div className="text-xs">{details.flag} / {details.agent}</div>
      </div>
      <div className="space-y-1">
        <div className="text-[10px] text-gray-500 uppercase tracking-wider">最大吃水</div>
        <div className="text-xs font-mono text-[#4DABFF]">{details.maxDraft}m</div>
      </div>
      <div className="space-y-1">
        <div className="text-[10px] text-gray-500 uppercase tracking-wider">船长 / 船宽</div>
        <div className="text-xs font-mono">{details.length}m × {details.width}m</div>
      </div>
      <div className="space-y-1">
        <div className="text-[10px] text-gray-500 uppercase tracking-wider">抵锚时间</div>
        <div className="text-xs font-mono">{details.arrivalTime}</div>
      </div>
      <div className="col-span-2 space-y-1">
        <div className="text-[10px] text-gray-500 uppercase tracking-wider">航程 (上一港 → 目的地)</div>
        <div className="text-xs flex items-center gap-2">
          <span className="text-gray-400">{details.lastPort}</span>
          <ChevronRight className="w-3 h-3 text-gray-600" />
          <span className="text-[#4DABFF] font-medium">{details.destination}</span>
        </div>
      </div>
      <div className="col-span-2 space-y-1">
        <div className="text-[10px] text-gray-500 uppercase tracking-wider">作业目的 / 载货信息</div>
        <div className="text-xs">
          <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-400 rounded text-[10px] mr-2">{details.purpose}</span>
          <span className="text-gray-300">{details.cargo}</span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="w-full max-w-md mx-auto bg-[#0F1115] text-white rounded-xl overflow-hidden shadow-2xl border border-white/5 font-sans">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#1D3D26] flex items-center justify-center">
            <Anchor className="text-[#4DFF88] w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">6号锚地</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '85%' }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-[#4DFF88]"
                />
              </div>
              <span className="text-[10px] text-gray-500 font-bold">态势 85%</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-[#3D2616] text-[#FF9F43] text-xs font-bold rounded-full border border-[#FF9F43]/20">
            临期 3
          </span>
          <span className="px-2 py-0.5 bg-[#3D1D1D] text-[#FF4D4D] text-xs font-bold rounded-full border border-[#FF4D4D]/20">
            超时 2
          </span>
          <ChevronDown className="w-4 h-4 text-gray-500 ml-1" />
        </div>
      </div>

      {/* Ship Type Statistics */}
      <div className="px-4 py-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs text-gray-500 font-bold uppercase tracking-wider">船舶类型统计</h3>
          <div className="flex bg-[#1A1D23] p-0.5 rounded-lg border border-white/5">
            <button 
              onClick={() => setStatView('grid')}
              className={cn(
                "p-1.5 rounded-md transition-all",
                statView === 'grid' ? "bg-[#252A33] text-[#4DABFF] shadow-lg" : "text-gray-500 hover:text-gray-300"
              )}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => setStatView('chart')}
              className={cn(
                "p-1.5 rounded-md transition-all",
                statView === 'chart' ? "bg-[#252A33] text-[#4DABFF] shadow-lg" : "text-gray-500 hover:text-gray-300"
              )}
            >
              <PieChartIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {statView === 'grid' ? (
            <motion.div 
              key="grid"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-wrap gap-2"
            >
              {SHIP_TYPES.map((stat, idx) => (
                <motion.div 
                  key={idx}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-[#1A1D23] border border-white/5 rounded-full hover:bg-[#252A33] transition-colors cursor-default"
                >
                  <Ship className="w-3.5 h-3.5 text-[#4DABFF]" />
                  <span className="text-xs text-gray-300">{stat.type}</span>
                  <span className="text-xs font-bold text-[#4DABFF]">{stat.count}艘</span>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="chart"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="h-56 w-full bg-[#1A1D23]/50 rounded-xl border border-white/5 p-3 relative flex gap-4"
            >
              {/* Left: Donut Chart */}
              <div className="w-[45%] h-full relative">
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
                  <span className="text-[10px] text-gray-500 font-medium truncate max-w-[60px] text-center">
                    {SHIP_TYPES[activeIndex]?.type}
                  </span>
                  <span className="text-sm font-bold text-[#4DABFF]">
                    {SHIP_TYPES[activeIndex]?.count}艘
                  </span>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      activeIndex={activeIndex}
                      activeShape={{
                        outerRadius: 55,
                        fill: CHART_COLORS[activeIndex % CHART_COLORS.length]
                      }}
                      data={SHIP_TYPES}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={50}
                      paddingAngle={4}
                      dataKey="count"
                      nameKey="type"
                      onMouseEnter={onPieEnter}
                    >
                      {SHIP_TYPES.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={CHART_COLORS[index % CHART_COLORS.length]} 
                          stroke="none"
                          style={{ outline: 'none' }}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Right: Detailed Distribution Legend */}
              <div className="flex-1 h-full overflow-y-auto pr-1 space-y-1 custom-scrollbar scrollbar-thin scrollbar-thumb-gray-800">
                {[...SHIP_TYPES].sort((a, b) => b.count - a.count).map((stat, idx) => {
                  const originalIndex = SHIP_TYPES.findIndex(s => s.type === stat.type);
                  const isHovered = activeIndex === originalIndex;
                  
                  return (
                    <div 
                      key={idx}
                      onMouseEnter={() => setActiveIndex(originalIndex)}
                      className={cn(
                        "flex items-center justify-between p-1.5 rounded-md transition-all cursor-default",
                        isHovered ? "bg-white/10 scale-[1.02]" : "hover:bg-white/5"
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div 
                          className="w-1.5 h-1.5 rounded-full shrink-0" 
                          style={{ backgroundColor: CHART_COLORS[originalIndex % CHART_COLORS.length] }} 
                        />
                        <span className={cn(
                          "text-[11px] truncate transition-colors",
                          isHovered ? "text-white font-medium" : "text-gray-400"
                        )}>
                          {stat.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <span className="text-[10px] text-gray-600">
                          {Math.round((stat.count / SHIP_TYPES.reduce((acc, curr) => acc + curr.count, 0)) * 100)}%
                        </span>
                        <span className={cn(
                          "text-[11px] font-bold",
                          isHovered ? "text-[#4DABFF]" : "text-gray-500"
                        )}>
                          {stat.count}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Overtime Statistics */}
      <div className="px-4 py-2 mt-2">
        <h3 className="text-xs text-gray-500 font-bold mb-3 uppercase tracking-wider">超时统计</h3>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#1A1D23] border border-white/5 rounded-full">
            <AlertTriangle className="w-3.5 h-3.5 text-[#FF4D4D]" />
            <span className="text-xs text-gray-300">超时 24h+</span>
            <span className="text-xs font-bold text-[#FF4D4D]">1艘</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#1A1D23] border border-white/5 rounded-full">
            <AlertTriangle className="w-3.5 h-3.5 text-[#FF4D4D]" />
            <span className="text-xs text-gray-300">超时 12-24h</span>
            <span className="text-xs font-bold text-[#FF4D4D]">1艘</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#1A1D23] border border-white/5 rounded-full">
            <AlertTriangle className="w-3.5 h-3.5 text-[#FF4D4D]" />
            <span className="text-xs text-gray-300">超时 0-12h</span>
            <span className="text-xs font-bold text-[#FF4D4D]">0艘</span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {/* Expiring Section */}
            <div className="px-4 py-4 mt-2">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#FF9F43]" />
                  <span className="text-sm font-bold text-[#FF9F43]">3 艘船舶锚泊临期</span>
                </div>
                <span className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">限时 48H</span>
              </div>
              
              <div className="space-y-2">
                {EXPIRING_SHIPS.map((ship, idx) => (
                  <motion.div 
                    key={ship.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => toggleShipExpand(ship.id)}
                    className={cn(
                      "group relative bg-[#1A1D23] border border-white/5 rounded-lg p-3 hover:border-[#FF9F43]/30 transition-all cursor-pointer",
                      expandedShipId === ship.id && "border-[#FF9F43]/50 bg-[#252A33]"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-[#252A33] flex items-center justify-center">
                        <Ship className="w-5 h-5 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold">{ship.nameCn}</span>
                          <span className="text-[10px] text-gray-500 font-medium">{ship.nameEn}</span>
                        </div>
                        <div className="text-[10px] text-gray-500 mt-0.5">到期: {ship.expiryTime}</div>
                        <div className="text-[10px] text-[#FF9F43] font-bold mt-0.5">{ship.remainingTime}</div>
                      </div>
                      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="px-2 py-0.5 bg-gray-800 text-[10px] rounded text-gray-400 hover:text-white transition-colors">忽略</button>
                        <button className="px-2 py-0.5 bg-[#3D2616] text-[10px] rounded text-[#FF9F43] hover:bg-[#4D321D] transition-colors">提醒</button>
                      </div>
                      <motion.div
                        animate={{ rotate: expandedShipId === ship.id ? 90 : 0 }}
                      >
                        <ChevronRight className="w-4 h-4 text-gray-700" />
                      </motion.div>
                    </div>
                    <AnimatePresence>
                      {expandedShipId === ship.id && (
                        <ShipDetailContent details={ship.details} />
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Overtime Section */}
            <div className="px-4 py-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#FF4D4D]" />
                  <span className="text-sm font-bold text-[#FF4D4D]">2 艘船舶锚泊超时</span>
                </div>
                <span className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">实时监测</span>
              </div>

              <div className="space-y-2">
                {OVERTIME_SHIPS.map((ship, idx) => (
                  <motion.div 
                    key={ship.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: (idx + 3) * 0.1 }}
                    onClick={() => toggleShipExpand(ship.id)}
                    className={cn(
                      "group relative bg-[#1A1D23] border border-white/5 rounded-lg p-3 hover:border-[#FF4D4D]/30 transition-all cursor-pointer",
                      expandedShipId === ship.id && "border-[#FF4D4D]/50 bg-[#252A33]"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-[#252A33] flex items-center justify-center">
                        <Clock className="w-5 h-5 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold">{ship.nameCn}</span>
                          <span className="text-[10px] text-gray-500 font-medium">{ship.nameEn}</span>
                        </div>
                        <div className="text-[10px] text-[#FF4D4D] font-bold mt-1">{ship.overtimeDuration}</div>
                      </div>
                      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="px-2 py-0.5 bg-gray-800 text-[10px] rounded text-gray-400 hover:text-white transition-colors">忽略</button>
                        <button className="px-2 py-0.5 bg-[#3D1D1D] text-[10px] rounded text-[#FF4D4D] hover:bg-[#4D2525] transition-colors">提醒</button>
                      </div>
                      <motion.div
                        animate={{ rotate: expandedShipId === ship.id ? 90 : 0 }}
                      >
                        <ChevronRight className="w-4 h-4 text-gray-700" />
                      </motion.div>
                    </div>
                    <AnimatePresence>
                      {expandedShipId === ship.id && (
                        <ShipDetailContent details={ship.details} />
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Collapse */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full py-4 flex items-center justify-center gap-2 text-[#4DABFF] text-xs font-medium hover:bg-white/5 transition-colors"
      >
        {isExpanded ? (
          <>
            <span>收起详情</span>
            <ChevronUp className="w-3 h-3" />
          </>
        ) : (
          <>
            <span>展开详情</span>
            <ChevronDown className="w-3 h-3" />
          </>
        )}
      </button>
    </div>
  );
}
