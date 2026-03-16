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
}

const platforms = [
  {
    name: "Facebook",
    icon: "📘",
    getUrl: (url: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: "WhatsApp",
    icon: "💬",
    getUrl: (url: string, title: string, desc: string, cta: string) =>
      `https://wa.me/?text=${encodeURIComponent(`*${title}*\n\n${desc}\n\n👉 ${cta}\n${url}\n\n— MIPROJET | Structuration • Financement • Incubation`)}`,
  },
  {
    name: "LinkedIn",
    icon: "💼",
    getUrl: (url: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    name: "Twitter / X",
    icon: "🐦",
    getUrl: (url: string, title: string, desc: string, cta: string) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${title}\n\n${desc.substring(0, 100)}...\n\n👉 ${cta}`)}&url=${encodeURIComponent(url)}`,
  },
  {
    name: "Telegram",
    icon: "✈️",
    getUrl: (url: string, title: string, desc: string, cta: string) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(`*${title}*\n\n${desc.substring(0, 120)}...\n\n👉 ${cta}`)}`,
  },
];

export const SocialSharePopup = ({ open, onClose, url, title, description, imageUrl, cta = "Découvrir sur MIPROJET" }: SocialSharePopupProps) => {
  const { toast } = useToast();

  const handleShare = (platform: typeof platforms[0]) => {
    window.open(platform.getUrl(url, title, description, cta), "_blank", "width=600,height=400");
  };

  const copyLink = () => {
    const shareText = `${title}\n\n${description.substring(0, 150)}...\n\n👉 ${cta}\n${url}`;
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
