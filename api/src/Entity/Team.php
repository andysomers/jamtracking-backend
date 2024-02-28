<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(mercure: true)]
#[ORM\Entity]
class Team
{
    #[ORM\Id]
    #[ORM\Column(type: 'integer')]
    #[ORM\GeneratedValue]
    private ?int $id = null;

    #[ORM\Column]
    #[Assert\NotBlank]
    public string $name = '';

    #[ORM\Column]
    public string $color = '';

    /** @var Skater[] Available skaters for this team. */
    #[ORM\OneToMany(mappedBy: 'team', targetEntity: Skater::class, cascade: ['persist', 'remove'])]
    public iterable $skaters;

    public function __construct()
    {
        $this->skaters = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }
}
