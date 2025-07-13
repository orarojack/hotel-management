"use client"

import { useState } from "react"
import { HelpCircle, MessageCircle, Phone, Mail, Clock, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqData = [
  {
    question: "How do I place an order?",
    answer:
      "Simply browse our menu, add items to your cart, fill in your details (name, phone, room number), and click 'Send Order via WhatsApp'. We'll receive your order instantly and start preparing it.",
  },
  {
    question: "What are your delivery hours?",
    answer:
      "We offer 24/7 room service! Our kitchen operates around the clock to serve you whenever you're hungry. Breakfast (6-11 AM), Lunch (12-4 PM), Dinner (6-11 PM), and Late Night (11 PM-6 AM).",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Most orders are delivered within 15-30 minutes depending on preparation time and your location in the hotel. You'll see the estimated prep time for each item on the menu.",
  },
  {
    question: "Can I modify my order after placing it?",
    answer:
      "Yes! Contact us immediately via WhatsApp at +254 703 781 668 with your order details. If we haven't started preparing your order, we can make changes.",
  },
  {
    question: "Do you accommodate dietary restrictions?",
    answer:
      "Please mention any dietary restrictions, allergies, or special requirements in the 'Special Requests' section when placing your order. Our chefs will accommodate your needs.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept cash on delivery, M-Pesa, card payments, and room billing. Payment options will be confirmed when we contact you via WhatsApp.",
  },
  {
    question: "Can I cancel my order?",
    answer:
      "Orders can be cancelled within 5 minutes of placing them. Contact us immediately via WhatsApp. Once preparation begins, cancellation may not be possible.",
  },
  {
    question: "Do you offer group orders for events?",
    answer:
      "Yes! For large orders or special events, please contact us directly at +254 703 781 668. We can arrange special menus and bulk orders with advance notice.",
  },
]

const contactMethods = [
  {
    icon: MessageCircle,
    title: "WhatsApp Support",
    description: "Get instant help via WhatsApp",
    action: "Chat Now",
    color: "bg-green-500",
    onClick: () => window.open("https://wa.me/254703781668?text=Hi, I need help with MunchHaven", "_blank"),
  },
  {
    icon: Phone,
    title: "Call Us",
    description: "Speak directly with our team",
    action: "Call Now",
    color: "bg-blue-500",
    onClick: () => window.open("tel:+254703781668", "_self"),
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "Send us a detailed message",
    action: "Email Us",
    color: "bg-purple-500",
    onClick: () => window.open("mailto:info@munchhaven.co.ke", "_self"),
  },
]

export function HelpWidget() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="rounded-full bg-blue-500 hover:bg-blue-600 shadow-2xl h-14 w-14 p-0 animate-pulse">
          <HelpCircle className="h-7 w-7 text-white" />
          <span className="sr-only">Get Help</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center">
            <HelpCircle className="h-6 w-6 mr-2 text-blue-500" />
            How can we help you?
          </DialogTitle>
          <DialogDescription>Find answers to common questions or contact our support team directly</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Methods */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Support</h3>
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon
              return (
                <Card
                  key={index}
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 border-0 bg-gradient-to-r from-gray-50 to-white"
                  onClick={method.onClick}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${method.color} rounded-lg flex items-center justify-center`}>
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{method.title}</h4>
                        <p className="text-sm text-gray-600">{method.description}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {/* Operating Hours */}
            <Card className="border-0 bg-gradient-to-br from-orange-50 to-red-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-orange-500" />
                  Operating Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">24/7 Room Service</span>
                    <Badge className="bg-green-100 text-green-800 border-0">Always Open</Badge>
                  </div>
                  <div className="text-xs text-gray-500 space-y-1 mt-3">
                    <p>🌅 Breakfast: 6:00 AM - 11:00 AM</p>
                    <p>🍽️ Lunch: 12:00 PM - 4:00 PM</p>
                    <p>🌙 Dinner: 6:00 PM - 11:00 PM</p>
                    <p>🌃 Late Night: 11:00 PM - 6:00 AM</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h3>
            <Accordion type="single" collapsible className="space-y-2">
              {faqData.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border border-gray-200 rounded-lg px-4">
                  <AccordionTrigger className="text-left font-medium text-gray-900 hover:text-blue-600">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* Quick Actions */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
              <h4 className="font-semibold text-gray-900 mb-3">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="justify-start h-auto p-3 bg-transparent"
                  onClick={() =>
                    window.open("https://wa.me/254703781668?text=I want to place a large order for an event", "_blank")
                  }
                >
                  <div className="text-left">
                    <p className="font-medium">Event Orders</p>
                    <p className="text-xs text-gray-500">Large group orders</p>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="justify-start h-auto p-3 bg-transparent"
                  onClick={() =>
                    window.open("https://wa.me/254703781668?text=I have a complaint about my recent order", "_blank")
                  }
                >
                  <div className="text-left">
                    <p className="font-medium">Report Issue</p>
                    <p className="text-xs text-gray-500">Order problems</p>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="justify-start h-auto p-3 bg-transparent"
                  onClick={() =>
                    window.open(
                      "https://wa.me/254703781668?text=I have dietary restrictions and need help with menu selection",
                      "_blank",
                    )
                  }
                >
                  <div className="text-left">
                    <p className="font-medium">Dietary Help</p>
                    <p className="text-xs text-gray-500">Special requirements</p>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="justify-start h-auto p-3 bg-transparent"
                  onClick={() =>
                    window.open("https://wa.me/254703781668?text=I want to provide feedback about MunchHaven", "_blank")
                  }
                >
                  <div className="text-left">
                    <p className="font-medium">Feedback</p>
                    <p className="text-xs text-gray-500">Share your thoughts</p>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
