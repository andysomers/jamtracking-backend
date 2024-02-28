<?php

namespace App\Factory;

use App\Entity\Skater;
use Doctrine\ORM\EntityRepository;
use Zenstruck\Foundry\ModelFactory;
use Zenstruck\Foundry\Proxy;
use Zenstruck\Foundry\RepositoryProxy;

/**
 * @extends ModelFactory<Skater>
 *
 * @method        Skater|Proxy                     create(array|callable $attributes = [])
 * @method static Skater|Proxy                     createOne(array $attributes = [])
 * @method static Skater|Proxy                     find(object|array|mixed $criteria)
 * @method static Skater|Proxy                     findOrCreate(array $attributes)
 * @method static Skater|Proxy                     first(string $sortedField = 'id')
 * @method static Skater|Proxy                     last(string $sortedField = 'id')
 * @method static Skater|Proxy                     random(array $attributes = [])
 * @method static Skater|Proxy                     randomOrCreate(array $attributes = [])
 * @method static EntityRepository|RepositoryProxy repository()
 * @method static Skater[]|Proxy[]                 all()
 * @method static Skater[]|Proxy[]                 createMany(int $number, array|callable $attributes = [])
 * @method static Skater[]|Proxy[]                 createSequence(iterable|callable $sequence)
 * @method static Skater[]|Proxy[]                 findBy(array $attributes)
 * @method static Skater[]|Proxy[]                 randomRange(int $min, int $max, array $attributes = [])
 * @method static Skater[]|Proxy[]                 randomSet(int $number, array $attributes = [])
 */
final class SkaterFactory extends ModelFactory
{
    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#factories-as-services
     *
     * @todo inject services if required
     */
    public function __construct()
    {
        parent::__construct();
    }

    protected function getDefaults(): array
    {
        return [
            'name' => self::faker()->name(),
            'number' => self::faker()->numberBetween(1, 9999),
        ];
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#initialization
     */
    protected function initialize(): self
    {
        return $this
            // ->afterInstantiate(function(Skater $skater): void {})
        ;
    }

    protected static function getClass(): string
    {
        return Skater::class;
    }
}
