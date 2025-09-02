"use client"

import type React from "react"

import { createContext, useContext, useReducer, type ReactNode } from "react"

interface Review {
  id: string
  productId: number
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  title: string
  comment: string
  date: string
  helpful: number
  verified: boolean
}

interface ReviewsState {
  reviews: Review[]
}

type ReviewsAction =
  | { type: "ADD_REVIEW"; payload: Omit<Review, "id" | "date" | "helpful"> }
  | { type: "MARK_HELPFUL"; payload: { reviewId: string } }

const ReviewsContext = createContext<{
  state: ReviewsState
  dispatch: React.Dispatch<ReviewsAction>
  addReview: (review: Omit<Review, "id" | "date" | "helpful">) => void
  getProductReviews: (productId: number) => Review[]
  getProductRating: (productId: number) => { average: number; count: number }
  markHelpful: (reviewId: string) => void
} | null>(null)

// Demo reviews data
const initialReviews: Review[] = [
  {
    id: "1",
    productId: 1,
    userId: "user1",
    userName: "Sarah Johnson",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    title: "Excellent sound quality!",
    comment:
      "These headphones exceeded my expectations. The noise cancellation is fantastic and the battery life is amazing. Perfect for long flights and daily commutes.",
    date: "2024-01-10",
    helpful: 12,
    verified: true,
  },
  {
    id: "2",
    productId: 1,
    userId: "user2",
    userName: "Mike Chen",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 4,
    title: "Great value for money",
    comment:
      "Really good headphones for the price. The build quality is solid and they're comfortable to wear for hours. Only minor complaint is that they can get a bit warm during extended use.",
    date: "2024-01-08",
    helpful: 8,
    verified: true,
  },
  {
    id: "3",
    productId: 1,
    userId: "user3",
    userName: "Emily Rodriguez",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    title: "Perfect for work from home",
    comment:
      "I use these for video calls all day and they're perfect. Clear audio, comfortable fit, and the noise cancellation helps me focus. Highly recommended!",
    date: "2024-01-05",
    helpful: 15,
    verified: true,
  },
  {
    id: "4",
    productId: 2,
    userId: "user4",
    userName: "David Wilson",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    title: "Best smartwatch I've owned",
    comment:
      "The fitness tracking is incredibly accurate and the battery life is outstanding. The interface is intuitive and the build quality feels premium.",
    date: "2024-01-12",
    helpful: 20,
    verified: true,
  },
  {
    id: "5",
    productId: 2,
    userId: "user5",
    userName: "Lisa Thompson",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 4,
    title: "Great fitness features",
    comment:
      "Love the health monitoring features. Sleep tracking is very detailed and the workout modes are comprehensive. Only wish the screen was a bit larger.",
    date: "2024-01-09",
    helpful: 7,
    verified: true,
  },
  {
    id: "6",
    productId: 3,
    userId: "user6",
    userName: "Alex Brown",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 4,
    title: "Sturdy and practical",
    comment:
      "This backpack has been perfect for my daily commute. Lots of compartments and the laptop section is well-padded. Material feels durable.",
    date: "2024-01-07",
    helpful: 5,
    verified: true,
  },
  {
    id: "7",
    productId: 4,
    userId: "user7",
    userName: "Jessica Davis",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    title: "Amazing sound quality",
    comment:
      "The bass is incredible and the sound is crystal clear. Perfect size for travel and the battery lasts forever. Worth every penny!",
    date: "2024-01-11",
    helpful: 18,
    verified: true,
  },
  {
    id: "8",
    productId: 5,
    userId: "user8",
    userName: "Tom Anderson",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    title: "Perfect running shoes",
    comment:
      "These shoes are incredibly comfortable and provide great support. I've run over 100 miles in them and they still look and feel great.",
    date: "2024-01-06",
    helpful: 13,
    verified: true,
  },
  {
    id: "9",
    productId: 6,
    userId: "user9",
    userName: "Rachel Green",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 4,
    title: "Great coffee maker",
    comment:
      "Makes excellent coffee and is easy to use. The programmable timer is convenient for morning routines. Cleaning could be easier but overall very satisfied.",
    date: "2024-01-04",
    helpful: 9,
    verified: true,
  },
]

function reviewsReducer(state: ReviewsState, action: ReviewsAction): ReviewsState {
  switch (action.type) {
    case "ADD_REVIEW": {
      const newReview: Review = {
        ...action.payload,
        id: Date.now().toString(),
        date: new Date().toISOString().split("T")[0],
        helpful: 0,
      }
      return {
        reviews: [newReview, ...state.reviews],
      }
    }
    case "MARK_HELPFUL": {
      return {
        reviews: state.reviews.map((review) =>
          review.id === action.payload.reviewId ? { ...review, helpful: review.helpful + 1 } : review,
        ),
      }
    }
    default:
      return state
  }
}

export function ReviewsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reviewsReducer, { reviews: initialReviews })

  const addReview = (review: Omit<Review, "id" | "date" | "helpful">) => {
    dispatch({ type: "ADD_REVIEW", payload: review })
  }

  const getProductReviews = (productId: number) => {
    return state.reviews.filter((review) => review.productId === productId)
  }

  const getProductRating = (productId: number) => {
    const productReviews = getProductReviews(productId)
    if (productReviews.length === 0) {
      return { average: 0, count: 0 }
    }
    const average = productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length
    return { average: Math.round(average * 10) / 10, count: productReviews.length }
  }

  const markHelpful = (reviewId: string) => {
    dispatch({ type: "MARK_HELPFUL", payload: { reviewId } })
  }

  return (
    <ReviewsContext.Provider
      value={{
        state,
        dispatch,
        addReview,
        getProductReviews,
        getProductRating,
        markHelpful,
      }}
    >
      {children}
    </ReviewsContext.Provider>
  )
}

export function useReviews() {
  const context = useContext(ReviewsContext)
  if (!context) {
    throw new Error("useReviews must be used within a ReviewsProvider")
  }
  return context
}
