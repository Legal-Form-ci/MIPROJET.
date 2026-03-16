import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Copy, ExternalLink } from "lucide-react";

interface SocialSharePopupProps {
  open: boolean;
  onClose: () => void;
  url: string;
  title: string;
  description: string;
  imageUrl?: string;
  cta?: string;
  shareType?: "news" | "opportunity" | "project" | "document" | "ebook";
  shareId?: string;
}

const SITE_URL = "https://miprojet.agricapital.ci";

function getShareUrl(props: SocialSharePopupProps): string {
  // Use /share/:type/:id for social crawlers to get proper OG tags
  if (props.shareType && props.shareId) {
    return `${SITE_URL}/share/${props.shareType}/${props.shareId}`;
  }
  return props.url;
}

const platforms = [
  {
    name: "Facebook",
    icon: "📘",
    getUrl: (shareUrl: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
  },
  {
    name: "WhatsApp",
    icon: "💬",
    getUrl: (shareUrl: string, title: string, desc: string, cta: string) =>
      `https://wa.me/?text=${encodeURIComponent(`*${title}*\n\n${desc}\n\n👉 ${cta}\n${shareUrl}\n\n— MIPROJET | Structuration • Financement • Incubation`)}`,
  },
  {
    name: "LinkedIn",
    icon: "💼",
    getUrl: (shareUrl: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
  },
  {
    name: "Twitter / X",
    icon: "🐦",
    getUrl: (shareUrl: string, title: string, desc: string, cta: string) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${title}\n\n${desc.substring(0, 100)}...\n\n👉 ${cta}`)}&url=${encodeURIComponent(shareUrl)}`,
  },
  {
    name: "Telegram",
    icon: "✈️",
    getUrl: (shareUrl: string, title: string, desc: string, cta: string) =>
      `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`*${title}*\n\n${desc.substring(0, 120)}...\n\n👉 ${cta}`)}`,
  },
];

export const SocialSharePopup = (props: SocialSharePopupProps) => {
  const { open, onClose, title, description, cta = "Découvrir sur MIPROJET" } = props;
  const { toast } = useToast();
  const shareUrl = getShareUrl(props);

  const handleShare = (platform: typeof platforms[0]) => {
    window.open(platform.getUrl(shareUrl, title, description, cta), "_blank", "width=600,height=400");
  };

  const copyLink = () => {
    const shareText = `${title}\n\n${description.substring(0, 150)}...\n\n👉 ${cta}\n${shareUrl}`;
    navigator.clipboard.writeText(shareText);
    toast({ title: "Copié !", description: "Le texte de partage a été copié dans le presse-papiers." });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Partager sur les réseaux sociaux</DialogTitle>
          <DialogDescription>Choisissez la plateforme de partage</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {platforms.map((platform) => (
            <Button
              key={platform.name}
              variant="outline"
              className="w-full justify-start gap-3 h-12"
              onClick={() => handleShare(platform)}
            >
              <span className="text-xl">{platform.icon}</span>
              <span>{platform.name}</span>
              <ExternalLink className="h-4 w-4 ml-auto text-muted-foreground" />
            </Button>
          ))}

          <div className="border-t pt-3">
            <Button variant="secondary" className="w-full gap-2" onClick={copyLink}>
              <Copy className="h-4 w-4" />
              Copier le texte de partage
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
