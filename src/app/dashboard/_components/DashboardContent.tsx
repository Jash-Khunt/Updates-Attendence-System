"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Progress } from "../../../components/ui/progress"
import { Calendar, Users, Activity, User, Phone, Mail, GraduationCap, Hash, Clock, Crown } from "lucide-react"
import { format } from "date-fns"

interface DashboardData {
  user: {
    name: string
    email: string
    image: string
  }
  userDetail: {
    department: string
    year: string
    semester: string
    enrollmentNo: string
    phoneNumber: string
  } | null
  soloRegistrations: Array<{
    id: string
    event: {
      id: string
      name: string
      type: string
    }
    registeredAt: Date
  }>
  groupRegistrations: Array<{
    id: string
    event: {
      id: string
      name: string
      type: string
    }
    group: {
      id: string
      isOwner: boolean
    }
    registeredAt: Date
  }>
  ownedGroups: Array<{
    id: string
    event: {
      id: string
      name: string
      type: string
    }
    createdAt: Date
  }>
  statistics: {
    totalRegistrations: number
    soloEvents: number
    groupEvents: number
    groupsOwned: number
    totalEvents: number
  }
}

const DashboardContent = ({ data }: { data: DashboardData }) => {
  const participationRate =
    data.statistics.totalEvents > 0 ? (data.statistics.totalRegistrations / data.statistics.totalEvents) * 100 : 0

  return (
    <div className="space-y-8">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-black/50 border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-300 hover:shadow-cyan-400/25 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-cyan-300">Total Events</CardTitle>
            <Activity className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{data.statistics.totalRegistrations}</div>
            <p className="text-xs text-cyan-300/70">Registered events</p>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-green-500/30 hover:border-green-400/60 transition-all duration-300 hover:shadow-green-400/25 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-300">Solo Events</CardTitle>
            <User className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{data.statistics.soloEvents}</div>
            <p className="text-xs text-green-300/70">Individual participation</p>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-purple-500/30 hover:border-purple-400/60 transition-all duration-300 hover:shadow-purple-400/25 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">Group Events</CardTitle>
            <Users className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{data.statistics.groupEvents}</div>
            <p className="text-xs text-purple-300/70">Team participation</p>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-yellow-500/30 hover:border-yellow-400/60 transition-all duration-300 hover:shadow-yellow-400/25 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-300">Groups Owned</CardTitle>
            <Crown className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{data.statistics.groupsOwned}</div>
            <p className="text-xs text-yellow-300/70">Leadership roles</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Section */}
        <Card className="bg-black/50 border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-cyan-300 flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 border-2 border-cyan-400/50">
                <AvatarImage src={data.user.image || "/placeholder.svg"} alt={data.user.name} />
                <AvatarFallback className="bg-cyan-900/50 text-cyan-300">{data.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-white">{data.user.name}</h3>
                <p className="text-cyan-300/70 flex items-center gap-1 flex-wrap break-all">
                  <Mail className="h-3 w-3 flex-shrink-0" />
                  {data.user.email}
                </p>
              </div>
            </div>

            {data.userDetail && (
              <div className="space-y-3 pt-4 border-t border-cyan-500/20">
                <div className="flex items-center gap-2 text-sm">
                  <GraduationCap className="h-4 w-4 text-cyan-400" />
                  <span className="text-cyan-300">Department:</span>
                  <Badge variant="outline" className="border-cyan-500/50 text-cyan-300">
                    {data.userDetail.department}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-cyan-400" />
                  <span className="text-cyan-300">Year:</span>
                  <span className="text-white">{data.userDetail.year}</span>
                  <span className="text-cyan-300">Semester:</span>
                  <span className="text-white">{data.userDetail.semester}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Hash className="h-4 w-4 text-cyan-400" />
                  <span className="text-cyan-300">Enrollment:</span>
                  <span className="text-white font-mono">{data.userDetail.enrollmentNo}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-cyan-400" />
                  <span className="text-cyan-300">Phone:</span>
                  <span className="text-white font-mono">{data.userDetail.phoneNumber}</span>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-cyan-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-cyan-300">Participation Rate</span>
                <span className="text-sm text-white">{participationRate.toFixed(1)}%</span>
              </div>
              <Progress value={participationRate} className="h-2 bg-cyan-900/30" />
            </div>
          </CardContent>
        </Card>

        {/* Activities Section */}
        <div className="lg:col-span-2">
          <Card className="bg-black/50 border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-cyan-300 flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Event Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-black/50 border border-cyan-500/30">
                  <TabsTrigger
                    value="all"
                    className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300"
                  >
                    All Events
                  </TabsTrigger>
                  <TabsTrigger
                    value="solo"
                    className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300"
                  >
                    Solo
                  </TabsTrigger>
                  <TabsTrigger
                    value="group"
                    className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300"
                  >
                    Group
                  </TabsTrigger>
                  <TabsTrigger
                    value="owned"
                    className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-300"
                  >
                    Owned
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4 mt-6">
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {[...data.soloRegistrations, ...data.groupRegistrations]
                      .sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime())
                      .map((registration) => (
                        <div
                          key={registration.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-black/30 border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                registration.event.type === "SOLO" ? "bg-green-400" : "bg-purple-400"
                              }`}
                            />
                            <div>
                              <p className="text-white font-medium">{registration.event.name}</p>
                              <div className="flex items-center gap-2 text-xs text-cyan-300/70">
                                <Clock className="h-3 w-3" />
                                {format(new Date(registration.registeredAt), "MMM dd, yyyy")}
                              </div>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className={`${
                              registration.event.type === "SOLO"
                                ? "border-green-500/50 text-green-300"
                                : "border-purple-500/50 text-purple-300"
                            }`}
                          >
                            {registration.event.type}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="solo" className="space-y-4 mt-6">
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {data.soloRegistrations.map((registration) => (
                      <div
                        key={registration.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-black/30 border border-green-500/20 hover:border-green-400/40 transition-all duration-300"
                      >
                        <div className="flex items-center gap-3">
                          <User className="h-4 w-4 text-green-400" />
                          <div>
                            <p className="text-white font-medium">{registration.event.name}</p>
                            <div className="flex items-center gap-2 text-xs text-green-300/70">
                              <Clock className="h-3 w-3" />
                              {format(new Date(registration.registeredAt), "MMM dd, yyyy")}
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="border-green-500/50 text-green-300">
                          SOLO
                        </Badge>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="group" className="space-y-4 mt-6">
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {data.groupRegistrations.map((registration) => (
                      <div
                        key={registration.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-black/30 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300"
                      >
                        <div className="flex items-center gap-3">
                          <Users className="h-4 w-4 text-purple-400" />
                          <div>
                            <p className="text-white font-medium">{registration.event.name}</p>
                            <div className="flex items-center gap-2 text-xs text-purple-300/70">
                              <Clock className="h-3 w-3" />
                              {format(new Date(registration.registeredAt), "MMM dd, yyyy")}
                              {registration.group.isOwner && (
                                <Badge variant="outline" className="border-yellow-500/50 text-yellow-300 text-xs">
                                  OWNER
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="border-purple-500/50 text-purple-300">
                          GROUP
                        </Badge>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="owned" className="space-y-4 mt-6">
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {data.ownedGroups.map((group) => (
                      <div
                        key={group.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-black/30 border border-yellow-500/20 hover:border-yellow-400/40 transition-all duration-300"
                      >
                        <div className="flex items-center gap-3">
                          <Crown className="h-4 w-4 text-yellow-400" />
                          <div>
                            <p className="text-white font-medium">{group.event.name}</p>
                            <div className="flex items-center gap-2 text-xs text-yellow-300/70">
                              <Clock className="h-3 w-3" />
                              {format(new Date(group.createdAt), "MMM dd, yyyy")}
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="border-yellow-500/50 text-yellow-300">
                          OWNER
                        </Badge>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default DashboardContent
