<?php

namespace App\Story;

use App\Factory\TeamFactory;
use Zenstruck\Foundry\Story;

final class DefaultTeamsStory extends Story
{
    public function build(): void
    {
        TeamFactory::createOne();
    }
}
