"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  change?: number
  changeType?: "increase" | "decrease" | "neutral"
  icon: React.ReactNode
  gradient: string
}

export function StatCard({ title, value, change, changeType = "neutral", icon, gradient }: StatCardProps) {
  const getTrendIcon = () => {
    switch (changeType) {
      case "increase":
        return <TrendingUp className="h-3 w-3" />
      case "decrease":
        return <TrendingDown className="h-3 w-3" />
      default:
        return <Minus className="h-3 w-3" />
    }
  }

  const getTrendColor = () => {
    switch (changeType) {
      case "increase":
        return "text-green-600"
      case "decrease":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <Card className={`border-0 shadow-lg ${gradient} hover:shadow-xl transition-all duration-200 group`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">{icon}</div>
          {change && (
            <Badge variant="secondary" className={`${getTrendColor()} bg-white/20 border-0`}>
              {getTrendIcon()}
              <span className="ml-1">{Math.abs(change)}%</span>
            </Badge>
          )}
        </div>
        <div>
          <h3 className="text-sm font-medium text-white/80 mb-1">{title}</h3>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}
