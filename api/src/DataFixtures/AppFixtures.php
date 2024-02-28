<?php

namespace App\DataFixtures;

use App\Story\DefaultSkatersStory;
use App\Story\DefaultTeamsStory;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        DefaultTeamsStory::load();
        DefaultSkatersStory::load();

        $manager->flush();
    }
}
