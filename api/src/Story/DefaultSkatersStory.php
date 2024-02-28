<?php

namespace App\Story;

use App\Factory\SkaterFactory;
use Zenstruck\Foundry\Story;

final class DefaultSkatersStory extends Story
{
    public function build(): void
    {
        SkaterFactory::createMany(10);
    }
}
