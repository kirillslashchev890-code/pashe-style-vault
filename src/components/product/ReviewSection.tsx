import { useState, useEffect, useRef } from "react";
import { Star, Send, ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { motion } from "framer-motion";
import ImageLightbox from "./ImageLightbox";

interface Review {
  id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
  user_name: string;
}

interface ReviewSectionProps {
  productId: string;
}

const ReviewSection = ({ productId }: ReviewSectionProps) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [canReview, setCanReview] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
    if (user) checkCanReview();
  }, [productId, user]);

  const fetchReviews = async () => {
    const { data } = await supabase
      .from("reviews")
      .select("id, rating, review_text, created_at, user_id")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    if (!data) return;

    // Get user names from profiles
    const userIds = [...new Set(data.map((r: any) => r.user_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, full_name")
      .in("user_id", userIds);

    const profileMap = new Map((profiles || []).map((p: any) => [p.user_id, p.full_name]));

    setReviews(data.map((r: any) => ({
      id: r.id,
      rating: r.rating,
      review_text: r.review_text,
      created_at: r.created_at,
      user_name: profileMap.get(r.user_id) || "Покупатель",
    })));
  };

  const checkCanReview = async () => {
    if (!user) return;
    // Check if user has an order with this product
    const { data: orders } = await supabase
      .from("orders")
      .select("id")
      .eq("user_id", user.id);

    if (!orders || orders.length === 0) { setCanReview(false); return; }

    const orderIds = orders.map((o: any) => o.id);
    const { data: items } = await supabase
      .from("order_items")
      .select("id")
      .in("order_id", orderIds)
      .eq("product_id", productId)
      .limit(1);

    setCanReview((items || []).length > 0);
  };

  const submitReview = async () => {
    if (!user || !canReview) return;
    setIsSubmitting(true);

    const { error } = await supabase.from("reviews").insert({
      user_id: user.id,
      product_id: productId,
      rating,
      review_text: text.trim() || null,
    } as any);

    setIsSubmitting(false);
    if (error) { toast.error("Ошибка при отправке отзыва"); return; }
    toast.success("Отзыв опубликован!");
    setText("");
    setRating(5);
    await fetchReviews();
    setCanReview(false); // prevent duplicate
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const StarRating = ({ value, interactive = false }: { value: number; interactive?: boolean }) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <button
          key={s}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && setRating(s)}
          onMouseEnter={() => interactive && setHoverRating(s)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          className={interactive ? "cursor-pointer" : "cursor-default"}
        >
          <Star
            size={interactive ? 24 : 16}
            className={`${(interactive ? (hoverRating || value) : value) >= s ? "text-primary fill-primary" : "text-muted-foreground"} transition-colors`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <div className="border-t border-border mt-12 pt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Отзывы {reviews.length > 0 && `(${reviews.length})`}</h2>
        {avgRating && (
          <div className="flex items-center gap-2">
            <StarRating value={Math.round(Number(avgRating))} />
            <span className="font-semibold">{avgRating}</span>
          </div>
        )}
      </div>

      {/* Write review form */}
      {canReview && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl p-5 mb-6"
        >
          <h3 className="font-semibold mb-3">Оставить отзыв</h3>
          <div className="mb-3">
            <span className="text-sm text-muted-foreground mr-2">Оценка:</span>
            <StarRating value={rating} interactive />
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Расскажите о вашем опыте..."
            className="w-full bg-background border border-border rounded-lg p-3 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-ring"
            maxLength={1000}
          />
          <div className="flex justify-end mt-3">
            <Button onClick={submitReview} disabled={isSubmitting} className="btn-gold">
              <Send size={16} className="mr-2" />
              {isSubmitting ? "Отправка..." : "Отправить"}
            </Button>
          </div>
        </motion.div>
      )}

      {/* Reviews list */}
      {reviews.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">Пока нет отзывов. Купите товар, чтобы оставить первый отзыв!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="border border-border rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
                    {review.user_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{review.user_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                </div>
                <StarRating value={review.rating} />
              </div>
              {review.review_text && <p className="text-sm text-foreground/80 mt-2">{review.review_text}</p>}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
